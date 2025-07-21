# Pages Directory

## Overview
The `pages` directory contains page-level components and views that represent different routes or screens in the application. Unlike the `app` directory which handles Next.js routing, this directory contains reusable page components that can be imported and used across different routes.

## Structure
```
pages/
├── index.ts              # Barrel exports for all pages
├── auth/                 # Authentication-related pages
│   ├── login-page.tsx
│   ├── register-page.tsx
│   ├── forgot-password-page.tsx
│   └── reset-password-page.tsx
├── dashboard/            # Dashboard and main app pages
│   ├── dashboard-page.tsx
│   ├── analytics-page.tsx
│   └── settings-page.tsx
├── chat/                 # Chat-related pages
│   ├── chat-page.tsx
│   ├── chat-room-page.tsx
│   └── chat-settings-page.tsx
├── user/                 # User management pages
│   ├── user-profile-page.tsx
│   ├── user-list-page.tsx
│   ├── user-detail-page.tsx
│   └── user-edit-page.tsx
├── admin/                # Admin-only pages
│   ├── admin-dashboard-page.tsx
│   ├── user-management-page.tsx
│   └── system-settings-page.tsx
└── common/               # Common/shared pages
    ├── home-page.tsx
    ├── about-page.tsx
    ├── contact-page.tsx
    ├── help-page.tsx
    ├── not-found-page.tsx
    └── error-page.tsx
```

## Page Component Architecture

### 1. Authentication Pages

#### Login Page (`auth/login-page.tsx`)
**Purpose**: User authentication and login functionality.

```typescript
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/store/hooks/use-auth-store';
import { useUIStore } from '@/store/ui-store';
import { useRegistry } from '@/hooks/useRegistry';
import { useValidation } from '@/hooks/useValidations';
import { LoginCredentials } from '@/types/auth';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showNotification } = useUIStore();
  const { data: formConfig } = useRegistry('forms/login-form');
  const { data: validationRules } = useRegistry('validations/auth-validations');
  const { validateForm, errors } = useValidation();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validationRules?.login) return;
    
    const validation = validateForm(formData, validationRules.login);
    if (!validation.isValid) return;

    try {
      setLoading(true);
      const result = await login(formData);
      
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Login Successful',
          message: 'Welcome back!',
        });
        router.push(ROUTES.DASHBOARD);
      } else {
        showNotification({
          type: 'error',
          title: 'Login Failed',
          message: result.error || 'Invalid credentials',
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Login Error',
        message: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LoginCredentials, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!formConfig) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            {formConfig.title}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email"
                error={errors.email}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>
              
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

### 2. Dashboard Pages

#### Dashboard Page (`dashboard/dashboard-page.tsx`)
**Purpose**: Main dashboard view with analytics and overview.

```typescript
"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/user/user-card';
import { ChatAvatar } from '@/components/chat/chat-avatar';
import { useAuth } from '@/store/hooks/use-auth-store';
import { useChatStore } from '@/store/chat-store';
import { useRegistry } from '@/hooks/useRegistry';
import { User } from '@/types/user';
import { formatDate } from '@/lib/date';

interface DashboardStats {
  totalUsers: number;
  activeChats: number;
  unreadMessages: number;
  onlineUsers: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { rooms, loadRooms, getUnreadCount } = useChatStore();
  const { data: dashboardConfig } = useRegistry('layouts/dashboard');
  const { data: usersData } = useRegistry('data/sample-users');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeChats: 0,
    unreadMessages: 0,
    onlineUsers: 0,
  });

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (usersData && rooms.length > 0) {
      setStats({
        totalUsers: usersData.users.length,
        activeChats: rooms.length,
        unreadMessages: getUnreadCount(),
        onlineUsers: usersData.users.filter(u => u.isOnline).length,
      });
    }
  }, [usersData, rooms, getUnreadCount]);

  const handleChatClick = (chatUser: User) => {
    // Navigate to chat or open chat modal
    console.log('Opening chat with:', chatUser.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your application today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeChats}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onlineUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
              <div className="space-y-4">
                {usersData?.users.slice(0, 5).map((user) => (
                  <UserCard
                    key={user.id}
                    user={{
                      ...user,
                      lastSeen: user.lastSeen ? new Date(user.lastSeen) : undefined,
                    }}
                    variant="compact"
                    size="sm"
                    showStatus={true}
                    showLastSeen={true}
                    onClick={() => handleChatClick(user)}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New User
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start Group Chat
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Chats */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Chats</h2>
            <div className="flex flex-wrap gap-4">
              {usersData?.users.filter(u => u.isOnline).map((user) => (
                <ChatAvatar
                  key={user.id}
                  user={user}
                  unreadCount={Math.floor(Math.random() * 5)}
                  onClick={() => handleChatClick(user)}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

### 3. Chat Pages

#### Chat Page (`chat/chat-page.tsx`)
**Purpose**: Main chat interface with room selection and messaging.

```typescript
"use client";

import { useState, useEffect } from 'react';
import { ChatAvatar } from '@/components/chat/chat-avatar';
import { MessageBubble } from '@/components/chat/message-bubble';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chat-store';
import { useRegistry } from '@/hooks/useRegistry';
import { User } from '@/types/user';

export default function ChatPage() {
  const {
    rooms,
    activeRoomId,
    messages,
    loadRooms,
    selectRoom,
    sendMessage,
    getRoomMessages,
    getActiveRoom,
  } = useChatStore();
  
  const { data: usersData } = useRegistry('data/sample-users');
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    // Find or create room for this user
    const room = rooms.find(r => r.participants.includes(user.id));
    if (room) {
      selectRoom(room.id);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeRoomId) return;
    
    try {
      await sendMessage(activeRoomId, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const activeRoom = getActiveRoom();
  const roomMessages = activeRoomId ? getRoomMessages(activeRoomId) : [];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - User List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {usersData?.users.map((user) => (
              <div
                key={user.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center space-x-3">
                  <ChatAvatar
                    user={user}
                    unreadCount={Math.floor(Math.random() * 3)}
                    onClick={() => handleUserSelect(user)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <ChatAvatar
                  user={selectedUser}
                  onClick={() => {}}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {roomMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  variant="primary"
                  disabled={!messageInput.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Page Integration Patterns

### 1. Registry-Driven Pages
```typescript
// Pages that use registry configuration
function DynamicFormPage({ formType }: { formType: string }) {
  const { data: formConfig } = useRegistry(`forms/${formType}`);
  const { data: validationRules } = useRegistry(`validations/${formType}`);
  
  return (
    <DynamicForm
      config={formConfig}
      validationRules={validationRules}
      onSubmit={handleSubmit}
    />
  );
}
```

### 2. Store-Connected Pages
```typescript
// Pages that connect to global state
function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useUIStore();
  
  const handleSave = async (data: UserUpdate) => {
    try {
      await updateProfile(data);
      showNotification({ type: 'success', title: 'Profile updated' });
    } catch (error) {
      showNotification({ type: 'error', title: 'Update failed' });
    }
  };
  
  return <UserProfileForm user={user} onSave={handleSave} />;
}
```

### 3. Layout-Aware Pages
```typescript
// Pages that adapt to different layouts
function ResponsivePage() {
  const { data: layoutConfig } = useRegistry('layouts/responsive');
  
  return (
    <DynamicLayout config={layoutConfig}>
      <PageContent />
    </DynamicLayout>
  );
}
```

## Best Practices

### 1. Page Structure
- Keep pages focused on layout and orchestration
- Move complex logic to custom hooks
- Use proper TypeScript interfaces
- Implement proper error handling

### 2. Data Management
- Use appropriate loading states
- Implement proper error boundaries
- Handle empty states gracefully
- Optimize for performance

### 3. User Experience
- Provide clear navigation
- Implement proper form validation
- Use consistent styling
- Add accessibility features

### 4. Code Organization
- Group related pages in folders
- Use barrel exports for clean imports
- Follow consistent naming conventions
- Add proper documentation

## Usage Examples

### Page Router Integration
```typescript
// app/dashboard/page.tsx
import DashboardPage from '@/pages/dashboard/dashboard-page';

export default function Dashboard() {
  return <DashboardPage />;
}
```

### Dynamic Page Routing
```typescript
// app/users/[id]/page.tsx
import UserDetailPage from '@/pages/user/user-detail-page';

interface PageProps {
  params: { id: string };
}

export default function UserDetail({ params }: PageProps) {
  return <UserDetailPage userId={params.id} />;
}
```

### Page with Layout
```typescript
// app/admin/layout.tsx
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
```

## Related Documentation
- [App README](../app/README.md) - Next.js routing integration
- [Components README](../components/README.md) - Page components
- [Store README](../store/README.md) - State management
- [Hooks README](../hooks/README.md) - Custom hooks usage
- [Types README](../types/README.md) - Page type definitions
