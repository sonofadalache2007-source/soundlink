/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { initialOrder, alternateOrders } from './data/mockData';
import { Order } from './types/order';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OrderWorkspace } from './components/orders/OrderWorkspace';
import { ExploreScreen } from './components/explore/ExploreScreen';
import { ServicesScreen } from './components/services/ServicesScreen';
import { MessagesScreen } from './components/messages/MessagesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('orders');
  const [currentOrder, setCurrentOrder] = useState<Order>(initialOrder);
  const [ordersList, setOrdersList] = useState<Order[]>(alternateOrders);

  const handleUpdateOrder = (updated: Order) => {
    setCurrentOrder(updated);
    setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const handleSelectOrder = (selected: Order) => {
    setCurrentOrder(selected);
  };

  const handleBookService = (serviceName: string, price: number, turnaround: string) => {
    const newOrder: Order = {
      ...initialOrder,
      id: `order-${Date.now()}`,
      orderNumber: `SL-${Math.floor(10000 + Math.random() * 90000)}`,
      title: serviceName,
      status: 'in_production',
      statusLabel: 'In Production',
      escrow: {
        amount: price,
        currency: 'USD',
        status: 'Secured',
      },
      delivery: {
        estimate: `${turnaround} Turnaround`,
        remaining: `${turnaround} remaining`,
      },
      revisionsRemaining: 3,
      deliverable: {
        title: `${serviceName.replace(/\s+/g, '_')}_Draft_v1.wav`,
        version: 'v1.0 Master',
        specs: '24-bit 48kHz • True Peak -0.3dB • Mastered',
        duration: 210,
        durationStr: '03:30',
        peak: '-0.3 dB TP',
        lufs: '-8.5 LUFS',
      },
    };

    setOrdersList((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setActiveTab('orders');
  };

  return (
    <div className="bg-[#10131a] text-[#e1e2eb] min-h-screen flex flex-col font-sans selection:bg-[#1db954]/30 selection:text-[#53e076]">
      {/* Top Application Header */}
      <Header
        currentTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
        orderNumber={currentOrder.orderNumber}
      />

      {/* Main Screen Viewport based on navigation flow */}
      <main className="flex-1 flex flex-col w-full">
        {activeTab === 'orders' && (
          <OrderWorkspace
            order={currentOrder}
            onUpdateOrder={handleUpdateOrder}
            onNavigateToChat={() => setActiveTab('messages')}
            allOrders={ordersList}
            onSelectOrder={handleSelectOrder}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreScreen
            onSelectCreator={(name, title, price) => {
              handleBookService(`${name} - ${title}`, price, '48 hours');
            }}
            onNavigateToOrder={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesScreen
            onBookService={handleBookService}
            onNavigateToOrder={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesScreen
            order={currentOrder}
            onNavigateToWorkspace={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            order={currentOrder}
            onNavigateToOrder={() => setActiveTab('orders')}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        messageBadge={1}
      />
    </div>
  );
}
