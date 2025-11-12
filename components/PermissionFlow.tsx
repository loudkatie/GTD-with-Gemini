import React from 'react';
import { Permission, PermissionStatus } from '../types';

interface PermissionFlowProps {
    permissions: Record<Permission, PermissionStatus>;
    onPermissionUpdate: (permission: Permission, status: PermissionStatus) => void;
}

interface PermissionButtonProps {
    label: string;
    status: PermissionStatus;
    onClick: () => void;
    Icon: React.FC<{className: string}>;
}

const GoogleIcon = ({ className }: {className: string}) => (
    <svg className={className} viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);
const LocationIcon = ({ className }: {className: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);
const BellIcon = ({ className }: {className: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const CheckIcon = ({ className }: {className: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const PermissionButton: React.FC<PermissionButtonProps> = ({ label, status, onClick, Icon }) => {
    const isGranted = status === 'granted';
    const isIdle = status === 'idle' || status === 'pending';
    
    return (
        <button
            onClick={onClick}
            disabled={!isIdle}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-300 ${
                isGranted 
                    ? 'bg-[#007AFF]/20 text-[#007AFF]' 
                    : 'bg-[#444444] hover:bg-[#555555] text-[#EAEAEA]'
            }`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isGranted ? 'bg-[#007AFF]' : 'bg-[#2A2A2A]'}`}>
                {isGranted ? <CheckIcon className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5 text-gray-300"/>}
            </div>
            <span className="flex-1 font-semibold">{label}</span>
        </button>
    );
};


const PermissionFlow: React.FC<PermissionFlowProps> = ({ onPermissionUpdate, permissions }) => {
    
    const handleGoogleClick = () => {
        onPermissionUpdate('google', 'pending');
        setTimeout(() => {
            onPermissionUpdate('google', 'granted');
        }, 1000);
    };
    
    const handleLocationClick = () => {
        onPermissionUpdate('location', 'pending');
        if (navigator.geolocation) {
            onPermissionUpdate('location', 'granted'); // App.tsx will handle the actual API call and state
        } else {
            onPermissionUpdate('location', 'denied');
        }
    };
    
    const handleNotificationsClick = () => {
        onPermissionUpdate('notifications', 'pending');
        // This is a mock for web, as real push notifications require a service worker.
        setTimeout(() => {
            onPermissionUpdate('notifications', 'granted');
        }, 500);
    };

    return (
        <div className="space-y-2 mt-2">
            <PermissionButton label="Connect Google Account" status={permissions.google} onClick={handleGoogleClick} Icon={GoogleIcon} />
            <PermissionButton label="Allow Location Access" status={permissions.location} onClick={handleLocationClick} Icon={LocationIcon} />
            <PermissionButton label="Enable 'Tap' Notifications" status={permissions.notifications} onClick={handleNotificationsClick} Icon={BellIcon} />
        </div>
    );
};

export default PermissionFlow;