interface Organisation {
  code: string;
  country: string;
  id: string;
  name: string;
  type: string;
}

interface Competitor {
  id: string;
  type: string;
  organisation: Organisation;
  name: string;
  result: string;
  rank?: number;
  previousUnitId?: string;
  wlt: 'WINNER' | 'LOSER';
  teamMembers: any[]; // Assuming an array of any for simplicity
}

interface Round {
  unitId: string;
  code: string;
  title: string;
  date: string;
  competitors: Competitor[];
}

interface Stage {
  code: string;
  title: string;
  rounds: Round[];
}

export interface BracketData {
  data: Stage[];
  this: string;
  links: any[]; // Assuming an array of any for simplicity
}
export interface CompetitorNodeProps {
  data: Competitor;
}
export interface MatchNodeProps {
  data: Round;
}
