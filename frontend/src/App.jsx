import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard.jsx';
import CreateLoan from './pages/Lender/CreateLoan.jsx';
import Loans from './pages/viewLoans.jsx';
import LoanDetails from './pages/LoanDetails.jsx';
import LoanSummary from './pages/Lender/LoanSummary.jsx';
import RepaymentHistory from './pages/RepaymentHistory.jsx';
import Profile from './pages/Profile.jsx';
import Repay from './pages/Borrower/RepayLoans.jsx';
import LenderRepayments from './pages/Repayments.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create-loan" element={<CreateLoan />} />
        <Route path ="/dashboard/loans" element={<Loans/>}/>
        <Route path ="/dashboard/loans/:id" element={<LoanDetails/>}/>
        <Route path ="/dashboard/loan-summary" element={<LoanSummary/>}/>
        <Route path="/repayments/:loanId/history" element={<RepaymentHistory />} />
        <Route path="/dashboard/repayments" element={<LenderRepayments />} />
        <Route path ="/dashboard/profile" element={<Profile/>}/>
        <Route path = "/dashboard/repay" element={<Repay/>}/>
      </Route>
    </Routes>
  );
}

export default App;
