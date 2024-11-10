import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Users, Key, Code, Settings, LineChart, Terminal, ChevronRight, ChevronDown, PanelLeftClose, PanelRightClose, Braces } from 'lucide-react';
import KeystrokesBiometrics from './KeystrokesBiometrics';
import { Button } from './ui/Button';
import { hydratedAuthAtom } from '../store/store';
import { useAtom } from 'jotai';

const Dashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState('keystroke');
    const [openMenus, setOpenMenus] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [auth] = useAtom(hydratedAuthAtom)
    useEffect(() => {
        console.log("Current auth state in Dashboard:", auth);
        console.log("User data:", auth?.user?.data);
        console.log("Is keystroke done:", auth?.user?.data?.is_keystroke_done);
        console.log("User email:", auth?.user?.data?.email);
    }, [auth]);
    const toggleSubmenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };
    const handleSidebarToggle = () => {
        document.querySelector('aside').classList.toggle('hidden');
        setIsSidebarOpen(!isSidebarOpen);
    }
    const RANDOM_API_KEY = "AJadsdkjasie73792kkasnasdkakjsd83787487234hshdjfhjshfj"; // Need to change this

    return (
        <div className="min-h-screen">
            <div className="xl:px-44 lg:px-20 md:px-14 px-6">
                <Header />
                <main className="flex gap-6 py-6">
                    {/* Sidebar */}
                    <aside className="w-64 bg-[#18181b] rounded-lg p-4">
                        <nav className="space-y-2">
                            {/* Profile Section */}
                            <div className="text-white">
                                <Button
                                    variant="doc"
                                    onClick={() => toggleSubmenu('profile')}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        <span>Profile</span>
                                    </div>
                                    {openMenus.profile ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </Button>
                                {openMenus.profile && (
                                    <div className="ml-4 mt-2 space-y-2">
                                        <Button
                                            variant="doc"
                                            onClick={() => setSelectedMenu('settings')}
                                            className="w-full items-center flex justify-start"
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            <span>Settings</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="text-white">
                                <Button
                                    variant="doc"
                                    onClick={() => setSelectedMenu('keystroke')}
                                    className="w-full flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <LineChart className="w-4 h-4 mr-2" />
                                        <span>Keystroke Biometrics</span>
                                    </div>
                                </Button>
                            </div>

                            <div className="text-white">
                                <Button
                                    variant="doc"
                                    onClick={() => toggleSubmenu('developer')}
                                    className="w-full flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <Code className="w-4 h-4 mr-2" />
                                        <span>Developer</span>
                                    </div>
                                    {openMenus.developer ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </Button>
                                {openMenus.developer && (
                                    <div className="ml-4 mt-2 space-y-2">
                                        <Button
                                            variant="doc"
                                            onClick={() => setSelectedMenu('installation')}
                                            className="w-full items-center flex justify-start"
                                        >
                                            <Braces className="w-4 h-4 mr-2" />
                                            <span>Installation</span>
                                        </Button>
                                        <Button
                                            variant="doc"
                                            onClick={() => setSelectedMenu('api')}
                                            className="w-full items-center flex justify-start"
                                        >
                                            <Key className="w-4 h-4 mr-2" />
                                            <span>API Keys</span>
                                        </Button>
                                        <Button
                                            variant="doc"
                                            onClick={() => setSelectedMenu('docs')}
                                            className="w-full items-center flex justify-start"
                                        >
                                            <Terminal className="w-4 h-4 mr-2" />
                                            <span>Documentation</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </aside>
                    {isSidebarOpen ? <PanelLeftClose color='white' size={24} className='cursor-pointer' onClick={handleSidebarToggle} /> : <PanelRightClose color='white' size={24} className='cursor-pointer' onClick={handleSidebarToggle} />}
                    <div className="flex-1 rounded-lg p-6 min-h-screen">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white">
                                {selectedMenu === 'keystroke' && 'Keystroke Biometrics Dashboard'}
                                {selectedMenu === 'api' && 'API Keys Management'}
                                {selectedMenu === 'settings' && (
                                    <div className="flex flex-col gap-2">
                                        <h1>Profile Settings</h1>
                                        <div className='flex items-center'>
                                            <p className='text-sm font-medium'>Your email:</p>
                                            <p className='text-sm pl-2 font-medium'>{auth.user?.data.email}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedMenu === 'docs' && 'Developer Documentation'}
                                {selectedMenu === 'installation' && 'Installation Guide'}
                            </h1>
                        </div>
                        <div className="text-white">
                            {selectedMenu === 'keystroke' && (!auth.user?.data?.is_keystroke_done ? <KeystrokesBiometrics /> : <div>
                                <p className="text-lg">You have already completed the keystroke biometrics setup.</p>
                            </div>)}

                            {selectedMenu === 'api' && (
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-semibold mb-2">Production API Key</h3>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-900 w-full px-3 py-2 rounded-xl">{RANDOM_API_KEY}</code>
                                            <Button size="sm" className="rounded-xl ">
                                                Copy
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className=" rounded-xl">
                                        Generate New Key
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;