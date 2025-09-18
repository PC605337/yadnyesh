import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Wallet, CreditCard, Download, Search, Filter, TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  transaction_type: 'debit' | 'credit' | 'refund' | 'consultation' | 'prescription' | 'lab_test' | 'wallet_topup';
  amount: number;
  description?: string;
  payment_method: string;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletBalance {
  total: number;
  available: number;
  locked: number;
  rewardsPoints: number;
}

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  wallet_status: string;
  kyc_status: string;
}

export const DigitalWallet = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit' | 'refund'>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('digital_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching wallet:', error);
        return;
      }

      if (!data) {
        // Create wallet if doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from('digital_wallets')
          .insert([{
            user_id: user.id,
            balance: 0,
            currency: 'INR',
            wallet_status: 'active',
            kyc_status: 'pending'
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating wallet:', createError);
          return;
        }
        setWalletData(newWallet);
      } else {
        setWalletData(data);
      }
    } catch (error) {
      console.error('Error in fetchWalletData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedTransactions = (data || []).map(txn => ({
        id: txn.id,
        transaction_type: (txn.transaction_type === 'wallet_topup' ? 'credit' : 
                          txn.transaction_type === 'consultation' ? 'consultation' :
                          txn.transaction_type === 'prescription' ? 'prescription' :
                          txn.transaction_type === 'lab_test' ? 'lab_test' :
                          'debit') as Transaction['transaction_type'],
        amount: txn.amount,
        description: `${txn.transaction_type.replace('_', ' ')} - ${txn.payment_method}`,
        payment_method: txn.payment_method,
        created_at: txn.created_at,
        status: txn.status as Transaction['status']
      }));

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
    }
  };

  const addMoney = async (amount: number) => {
    if (!user || !walletData) return;

    try {
      // Create transaction record
      const { error: txnError } = await supabase
        .from('payment_transactions')
        .insert([{
          patient_id: user.id,
          transaction_type: 'wallet_topup',
          payment_method: 'upi',
          amount: amount,
          transaction_id: `TXN_${Date.now()}`,
          status: 'completed',
          payment_gateway: 'razorpay'
        }]);

      if (txnError) {
        throw txnError;
      }

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('digital_wallets')
        .update({ balance: walletData.balance + amount })
        .eq('user_id', user.id);

      if (walletError) {
        throw walletError;
      }

      toast({
        title: "Money Added Successfully",
        description: `₹${amount} has been added to your wallet.`,
      });

      // Refresh data
      fetchWalletData();
      fetchTransactions();
    } catch (error) {
      console.error('Error adding money:', error);
      toast({
        title: "Error",
        description: "Failed to add money to wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const walletBalance: WalletBalance = {
    total: walletData?.balance || 0,
    available: walletData?.balance || 0,
    locked: 0,
    rewardsPoints: 125
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = (txn.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || txn.transaction_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTransactionIcon = (transactionType: string) => {
    switch (transactionType) {
      case 'consultation': return '💻';
      case 'lab_test': return '🧪';
      case 'prescription': return '💊';
      case 'wallet_topup': 
      case 'credit': return '💰';
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
      case 'credit':
      case 'wallet_topup': return 'text-green-600';
      case 'debit':
      case 'consultation':
      case 'prescription':
      case 'lab_test': return 'text-red-600';
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
              <Button className="w-full" onClick={() => addMoney(1000)}>
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
                              {getTransactionIcon(transaction.transaction_type)}
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
                                <span>{new Date(transaction.created_at).toLocaleString()}</span>
                                <span>via {transaction.payment_method}</span>
                              </div>
                            </div>
                          </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-lg font-semibold ${getTypeColor(transaction.transaction_type)}`}>
                              {transaction.transaction_type === 'credit' || transaction.transaction_type === 'wallet_topup' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                            </div>
                            <Button variant="ghost" size="sm" className="mt-1">
                              <Download className="h-3 w-3 mr-1" />
                              Receipt
                            </Button>
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