export interface Participant {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        area: string;
    };
    progress: string;
    status: string;
  }