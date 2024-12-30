import {Outlet} from 'react-router-dom';
import {Sidebar} from '../components/Sidebar';
import {UserNav} from '../components/UserNav';

export default function MainLayout() {
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}