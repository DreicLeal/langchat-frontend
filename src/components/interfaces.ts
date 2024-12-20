export interface InputProps {
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label: string;
    error?: string;
    name: string;
  }

  export interface HeaderProps {
    title: string;
  }
  