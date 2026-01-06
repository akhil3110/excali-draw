import { Pen } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

function Navbar({ onLoginClick, onSignUpClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Pen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">DrawFlow</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={onSignUpClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
