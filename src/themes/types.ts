export interface IAvatarSize {
  width: string;
  height: string;
  fontSize: string;
}

export interface IAvatarFormat {
  cursor?: string;
  background?: string;
  color?: string;
  borderRadius: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  fontFamily: string;
}

export interface IMenuFormat {
  cursor?: string;
  background?: string;
  color?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'; // Refined type
  fontSize: string;
  fontFamily: string;
  fontWeight?: 'normal' | 'bold' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; // Refined type
  lineHeight?: string | number;
}
