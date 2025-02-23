import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge as FlowEdge,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from '@/types/card';
import { Folder } from '@/types/folder';
import { X, Plus, FileText, Bookmark, GitBranch, Save, Undo, Redo, ZoomIn, ZoomOut } from 'lucide-react';
import { CardNode, FolderNode } from '@/components/mindmap/CustomNodes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  folders: Folder[];
  currentFolderId: string | null;
  onAddCard?: (card: Partial<Card>) => void;
  onSaveMindMap?: (layout: { nodes: Node[]; edges: Edge[] }) => void;
}

// Define node types
const nodeTypes = {
  card: CardNode,
  folder: FolderNode,
};

// Default edge options
const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
  style: { stroke: 'hsl(var(--muted-foreground))' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'hsl(var(--muted-foreground))',
  },
};

export const MindMapModal: React.FC<MindMapModalProps> = ({
  isOpen,
  onClose,
  cards,
  folders,
  currentFolderId,
  onAddCard,
  onSaveMindMap,
}) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false);
  const [newNodeType, setNewNodeType] = useState<'note' | 'bookmark' | 'flow' | null>(null);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDescription, setNewNodeDescription] = useState('');
  const [undoStack, setUndoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);

  // Convert cards and folders to nodes and edges
  const initialNodes = useMemo(() => {
    const nodes: Node[] = [];
    
    // Add current folder as root node
    if (currentFolderId) {
      const currentFolder = folders.find(f => f.id === currentFolderId);
      if (currentFolder) {
        nodes.push({
          id: currentFolder.id,
          type: 'folder',
          data: { label: currentFolder.name, color: currentFolder.color },
          position: { x: 0, y: 0 },
          draggable: true,
          connectable: true,
        });
      }
    }

    // Add cards as child nodes in a circular layout
    const radius = 300;
    const cardCount = cards.length;
    cards.forEach((card, index) => {
      const angle = (2 * Math.PI * index) / cardCount;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      nodes.push({
        id: card.id,
        type: 'card',
        data: { 
          label: card.title,
          type: card.type,
          description: card.description || '',
          tags: card.tags || [],
        },
        position: { x, y },
        draggable: true,
        connectable: true,
      });
    });

    return nodes;
  }, [cards, folders, currentFolderId]);

  // Create edges from current folder to all cards
  const initialEdges = useMemo(() => {
    if (!currentFolderId) return [];
    return cards.map((card): FlowEdge => ({
      id: `${currentFolderId}-${card.id}`,
      source: currentFolderId,
      target: card.id,
      ...defaultEdgeOptions,
    }));
  }, [cards, currentFolderId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Save current state to undo stack before making changes
  const saveToHistory = useCallback(() => {
    setUndoStack(prev => [...prev, { nodes, edges }]);
    setRedoStack([]); // Clear redo stack when new changes are made
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { nodes, edges }]);
    setUndoStack(prev => prev.slice(0, -1));
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
  }, [undoStack, nodes, edges, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { nodes, edges }]);
    setRedoStack(prev => prev.slice(0, -1));
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  }, [redoStack, nodes, edges, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    saveToHistory();
    setEdges((eds) => addEdge({ ...params, ...defaultEdgeOptions }, eds));
  }, [setEdges, saveToHistory]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    // If the node is already selected, deselect it
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      return;
    }
    
    // If we have a selected node and click another node, create a connection
    if (selectedNode && selectedNode.id !== node.id) {
      const newEdge = {
        id: `${selectedNode.id}-${node.id}`,
        source: selectedNode.id,
        target: node.id,
        ...defaultEdgeOptions,
      };
      
      saveToHistory();
      setEdges(prev => [...prev, newEdge]);
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
  }, [selectedNode, setEdges, saveToHistory]);

  const handleNodeDragStart = useCallback(() => {
    saveToHistory();
  }, [saveToHistory]);

  const handleAddNodeClick = (type: 'note' | 'bookmark' | 'flow') => {
    setNewNodeType(type);
    setIsAddNodeDialogOpen(true);
  };

  const handleCreateNode = () => {
    if (!newNodeType || !newNodeTitle || !currentFolderId) return;

    // Create the new card
    const newCard: Partial<Card> = {
      type: newNodeType,
      title: newNodeTitle,
      description: newNodeDescription,
      folderId: currentFolderId,
      tags: [],
    };

    // Add the card through the parent component
    onAddCard?.(newCard);

    // Close the dialog and reset state
    setIsAddNodeDialogOpen(false);
    setNewNodeType(null);
    setNewNodeTitle('');
    setNewNodeDescription('');
  };

  const handleSave = useCallback(() => {
    if (onSaveMindMap) {
      onSaveMindMap({ nodes, edges });
      toast.success('Mind map saved successfully');
    }
  }, [nodes, edges, onSaveMindMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 bg-card rounded-lg shadow-lg z-50 flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <h2 className="text-lg font-medium text-foreground">Mind Map View</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              className="flex items-center gap-2 text-foreground hover:text-foreground"
            >
              <Save className="w-4 h-4" />
              Save Layout
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flow Container */}
        <div className="flex-1 w-full h-full min-h-[500px] relative bg-background">
          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              style: {
                ...node.style,
                // Add a highlight effect for selected nodes
                boxShadow: selectedNode?.id === node.id ? '0 0 0 2px hsl(var(--primary))' : undefined,
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onNodeDragStart={handleNodeDragStart}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            connectOnClick={true}
            className="bg-background"
          >
            <Background 
              gap={15}
              size={1}
              color="hsl(var(--muted-foreground))"
              className="!bg-background opacity-20"
            />
            <Controls className="bg-card border border-border shadow-sm" />
            
            {/* Toolbar */}
            <Panel position="top-left" className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm">
              <Button
                size="sm"
                variant="outline"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="text-foreground hover:text-foreground"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="text-foreground hover:text-foreground"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </Panel>
            
            {/* Add Node Panel */}
            <Panel position="top-right" className="bg-transparent">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="flex items-center gap-2 text-foreground hover:text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                    Add Node
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAddNodeClick('note')} className="text-foreground hover:text-accent-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    Add Note
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddNodeClick('bookmark')} className="text-foreground hover:text-accent-foreground">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Add Bookmark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddNodeClick('flow')} className="text-foreground hover:text-accent-foreground">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Add Flow
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Add Node Dialog */}
      <Dialog open={isAddNodeDialogOpen} onOpenChange={setIsAddNodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New {newNodeType?.charAt(0).toUpperCase()}{newNodeType?.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Title</Label>
              <Input
                id="title"
                value={newNodeTitle}
                onChange={(e) => setNewNodeTitle(e.target.value)}
                placeholder="Enter title..."
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Input
                id="description"
                value={newNodeDescription}
                onChange={(e) => setNewNodeDescription(e.target.value)}
                placeholder="Enter description..."
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddNodeDialogOpen(false)}
              className="text-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNode}
              disabled={!newNodeTitle.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 