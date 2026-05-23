interface ProgressBarProps {
  value: number;
}

const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div style={{width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '12px'}}>
      <div 
        style={{
          background: '#10b981',
          height: '12px',
          borderRadius: '9999px',
          width: `${Math.min(value, 100)}%`,
          transition: 'width 0.3s'
        }}
      />
    </div>
  );
};

export default ProgressBar;