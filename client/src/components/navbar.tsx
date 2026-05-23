import { Bell, UserCircle2 } from "lucide-react";

interface Props {
  totalSavings: number;
}

const Navbar = ({ totalSavings }: Props) => {
  return (
    <nav style={{
      background: 'white', 
      padding: '16px 24px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#111', margin: 0}}>
          Savings Tracker
        </h1>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <div style={{textAlign: 'right'}}>
          <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Total Savings</p>
          <p style={{fontSize: '20px', fontWeight: 'bold', color: '#10b981', margin: 0}}>
            ₹{totalSavings.toLocaleString()}
          </p>
        </div>
        
        <Bell size={24} color="#6b7280" style={{cursor: 'pointer'}} />
        <UserCircle2 size={32} color="#6b7280" style={{cursor: 'pointer'}} />
      </div>
    </nav>
  );
};

export default Navbar;