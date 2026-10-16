export type OrderStatus = 'in_production' | 'in_review' | 'completed' | 'revision_requested';

export interface Milestone {
  id: string;
  name: string;
  status: 'done' | 'active' | 'upcoming';
  subtext: string;
  icon: string;
  date?: string;
  description?: string;
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  meta: string;
  type: 'vocal' | 'zip' | 'reference' | 'stem';
  url?: string;
  duration?: string;
  isPlaying?: boolean;
}

export interface StudioTask {
  id: string;
  title: string;
  tool: string;
  completed: boolean;
  isRendering?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  title: string;
  status: OrderStatus;
  statusLabel: string;
  client: {
    name: string;
    avatar: string;
    online: boolean;
  };
  producer: {
    name: string;
    avatar: string;
    badge: string;
    note: string;
  };
  escrow: {
    amount: number;
    currency: string;
    status: string;
  };
  delivery: {
    estimate: string;
    remaining: string;
  };
  revisionsRemaining: number;
  maxRevisions: number;
  milestones: Milestone[];
  deliverable: {
    title: string;
    version: string;
    specs: string;
    duration: number; // in seconds
    durationStr: string;
    peak: string;
    lufs: string;
  };
  sharedFiles: SharedFile[];
  tasks: StudioTask[];
}
