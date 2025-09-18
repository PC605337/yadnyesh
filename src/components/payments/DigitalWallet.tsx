import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Wallet, CreditCard, Download, Search, Filter, TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'debit' | 'credit' | 'refund';
  amount: number;
  description: string;
  serviceType: 'teleconsult' | 'lab_test' | 'hospital_visit' | 'prescription' | 'wallet_topup';
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  receiptUrl?: string;
  doctorName?: string;
  refundReason?: string;
}

interface WalletBalance {
  total: number;
  available: number;
  locked: number;
  rewardsPoints: number;
}

export const DigitalWallet = () => {
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    total: 2450.00,
    available: 2200.00,
    locked: 250.00,
    rewardsPoints: 125
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN_001',
      type: 'debit',
      amount: 500,
      description: 'Teleconsultation with Dr. Sharma',
      serviceType: 'teleconsult',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      paymentMethod: 'UPI',
      doctorName: 'Dr. Rajesh Sharma',
      receiptUrl: '#'
    },
    {
      id: 'TXN_002',
      type: 'debit',
      amount: 850,
      description: 'Blood Test Package',
      serviceType: 'lab_test',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      paymentMethod: 'Credit Card',
      receiptUrl: '#'
    },
    {
      id: 'TXN_003',
      type: 'credit',
      amount: 1000,
      description: 'Wallet Top-up',
      serviceType: 'wallet_topup',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      paymentMethod: 'Net Banking'
    },
    {
      id: 'TXN_004',
      type: 'refund',
      amount: 300,
      description: 'Appointment Cancelled',
      serviceType: 'teleconsult',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      paymentMethod: 'UPI',
      refundReason: 'Doctor unavailable'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit' | 'refund'>('all');

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTransactionIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'teleconsult': return '💻';
      case 'lab_test': return '🧪';
      case 'hospital_visit': return '🏥';
      case 'prescription': return '💊';
      case 'wallet_topup': return '💰';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'text-green-600';
      case 'debit': return 'text-red-600';
      case 'refund': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const downloadStatement = (period: 'month' | 'quarter' | 'year') => {
    // Mock statement download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `wallet-statement-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Digital Wallet
          </CardTitle>
          <CardDescription>
            Your healthcare payment wallet with instant transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₹{walletBalance.available.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-muted-foreground">Available Balance</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-xl font-semibold text-muted-foreground">
                ₹{walletBalance.locked.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-muted-foreground">Locked Amount</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-xl font-semibold text-orange-600">
                {walletBalance.rewardsPoints}
              </div>
              <div className="text-sm text-muted-foreground">Reward Points</div>
            </div>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center">
              <Button className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Money
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transaction History
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => downloadStatement('month')}>
                <Download className="h-4 w-4 mr-2" />
                Statement
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all" onClick={() => setFilterType('all')}>All</TabsTrigger>
                <TabsTrigger value="debit" onClick={() => setFilterType('debit')}>Paid</TabsTrigger>
                <TabsTrigger value="credit" onClick={() => setFilterType('credit')}>Received</TabsTrigger>
                <TabsTrigger value="refund" onClick={() => setFilterType('refund')}>Refunds</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-2xl">
                              {getTransactionIcon(transaction.serviceType)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{transaction.description}</h4>
                                <Badge className={getStatusColor(transaction.status)}>
                                  {transaction.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>ID: {transaction.id}</div>
                                <div className="flex items-center gap-4">
                                  <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                                  <span>via {transaction.paymentMethod}</span>
                                </div>
                                {transaction.doctorName && (
                                  <div>Doctor: {transaction.doctorName}</div>
                                )}
                                {transaction.refundReason && (
                                  <div>Reason: {transaction.refundReason}</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                              {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN')}
                            </div>
                            {transaction.receiptUrl && (
                              <Button variant="ghost" size="sm" className="mt-1">
                                <Download className="h-3 w-3 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Monthly Spending</h3>
            <div className="text-2xl font-bold text-green-600">₹3,450</div>
            <div className="text-sm text-muted-foreground">↑ 12% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">This Month</h3>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-muted-foreground">Total transactions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Wallet className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Rewards Earned</h3>
            <div className="text-2xl font-bold text-purple-600">125</div>
            <div className="text-sm text-muted-foreground">Points this month</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};