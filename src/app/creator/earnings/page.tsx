'use client'

import { useState } from 'react'
import Link from 'next/link'

interface EarningsData {
  totalEarnings: number
  availableBalance: number
  pendingBalance: number
  withdrawnAmount: number
}

interface Transaction {
  id: string
  type: 'earning' | 'withdrawal' | 'pending'
  projectTitle: string
  amount: number
  fee: number
  netAmount: number
  status: 'completed' | 'pending' | 'processing'
  date: string
  client: string
}

interface WithdrawalHistory {
  id: string
  amount: number
  method: 'bank' | 'paypal'
  status: 'completed' | 'processing' | 'failed'
  requestDate: string
  completeDate?: string
  bankInfo?: {
    bankName: string
    accountNumber: string
  }
}

export default function CreatorEarningsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'withdrawals'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('month')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'paypal'>('bank')

  // モックデータ
  const earningsData: EarningsData = {
    totalEarnings: 485000,
    availableBalance: 125000,
    pendingBalance: 60000,
    withdrawnAmount: 300000
  }

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earning',
      projectTitle: 'アイドルグループ新曲のアレンジ制作',
      amount: 80000,
      fee: 8000,
      netAmount: 72000,
      status: 'completed',
      date: '2025-04-15',
      client: 'RINGAX Records'
    },
    {
      id: '2',
      type: 'earning',
      projectTitle: 'CM音楽制作',
      amount: 50000,
      fee: 5000,
      netAmount: 45000,
      status: 'completed',
      date: '2025-04-10',
      client: '株式会社ABC'
    },
    {
      id: '3',
      type: 'pending',
      projectTitle: 'ゲームBGM制作',
      amount: 60000,
      fee: 6000,
      netAmount: 54000,
      status: 'pending',
      date: '2025-04-20',
      client: 'ゲーム開発スタジオXYZ'
    },
    {
      id: '4',
      type: 'earning',
      projectTitle: '弾き語り曲のバンドアレンジ',
      amount: 35000,
      fee: 3500,
      netAmount: 31500,
      status: 'completed',
      date: '2025-03-28',
      client: '田中一郎'
    },
    {
      id: '5',
      type: 'earning',
      projectTitle: 'ミキシング・マスタリング',
      amount: 25000,
      fee: 2500,
      netAmount: 22500,
      status: 'completed',
      date: '2025-03-20',
      client: 'インディーズバンド'
    }
  ]

  const withdrawalHistory: WithdrawalHistory[] = [
    {
      id: '1',
      amount: 100000,
      method: 'bank',
      status: 'completed',
      requestDate: '2025-03-01',
      completeDate: '2025-03-03',
      bankInfo: {
        bankName: '三菱UFJ銀行',
        accountNumber: '****1234'
      }
    },
    {
      id: '2',
      amount: 50000,
      method: 'bank',
      status: 'completed',
      requestDate: '2025-02-15',
      completeDate: '2025-02-17',
      bankInfo: {
        bankName: '三菱UFJ銀行',
        accountNumber: '****1234'
      }
    },
    {
      id: '3',
      amount: 150000,
      method: 'bank',
      status: 'completed',
      requestDate: '2025-01-20',
      completeDate: '2025-01-22',
      bankInfo: {
        bankName: '三菱UFJ銀行',
        accountNumber: '****1234'
      }
    }
  ]

  // 月別収益データ（グラフ用）
  const monthlyEarnings = [
    { month: '1月', amount: 120000 },
    { month: '2月', amount: 95000 },
    { month: '3月', amount: 145000 },
    { month: '4月', amount: 125000 }
  ]

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: '完了', className: 'bg-green-100 text-green-800' },
      pending: { label: '処理中', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: '処理中', className: 'bg-blue-100 text-blue-800' },
      failed: { label: '失敗', className: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount)
    if (amount > 0 && amount <= earningsData.availableBalance) {
      // TODO: API呼び出し
      alert(`${formatCurrency(amount)}の出金申請を受け付けました。`)
      setShowWithdrawModal(false)
      setWithdrawAmount('')
    } else {
      alert('正しい金額を入力してください。')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#ff6232]">
                Creax
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/projects" className="text-gray-700 hover:text-[#ff6232]">
                  案件を探す
                </Link>
                <Link href="/creator/dashboard" className="text-gray-700 hover:text-[#ff6232]">
                  ダッシュボード
                </Link>
                <Link href="/messages" className="text-gray-700 hover:text-[#ff6232]">
                  メッセージ
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* パンくず */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm">
          <Link href="/creator/dashboard" className="text-gray-500 hover:text-gray-700">
            ダッシュボード
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">収益管理</span>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* 収益サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">総収益</p>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.totalEarnings)}</p>
            <p className="text-xs text-green-600 mt-1">+12% 前月比</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">出金可能額</p>
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(earningsData.availableBalance)}</p>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="text-xs text-[#ff6232] hover:underline mt-1"
            >
              出金申請 →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">処理中</p>
              <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(earningsData.pendingBalance)}</p>
            <p className="text-xs text-gray-500 mt-1">検収待ち</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">出金済み</p>
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(earningsData.withdrawnAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">累計出金額</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#ff6232] text-[#ff6232]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-[#ff6232] text-[#ff6232]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                取引履歴
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'border-[#ff6232] text-[#ff6232]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                出金履歴
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 概要タブ */}
            {activeTab === 'overview' && (
              <div>
                {/* 期間選択 */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">収益推移</h3>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                  >
                    <option value="month">今月</option>
                    <option value="quarter">過去3ヶ月</option>
                    <option value="year">今年</option>
                    <option value="all">全期間</option>
                  </select>
                </div>

                {/* 簡易グラフ */}
                <div className="mb-8">
                  <div className="flex items-end justify-between h-48 mb-2">
                    {monthlyEarnings.map((data, index) => {
                      const maxAmount = Math.max(...monthlyEarnings.map(d => d.amount))
                      const height = (data.amount / maxAmount) * 100
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full max-w-[60px] bg-[#ff6232] rounded-t-lg transition-all duration-300 hover:bg-[#ff8a5b]"
                               style={{ height: `${height}%` }}
                               title={formatCurrency(data.amount)}>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between">
                    {monthlyEarnings.map((data, index) => (
                      <div key={index} className="flex-1 text-center">
                        <p className="text-xs text-gray-500">{data.month}</p>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(data.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">今月の案件数</p>
                    <p className="text-xl font-bold text-gray-900">8件</p>
                    <p className="text-xs text-green-600">+2件 前月比</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">平均単価</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(60625)}</p>
                    <p className="text-xs text-green-600">+15% 前月比</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">評価平均</p>
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-gray-900 mr-2">4.8</p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 取引履歴タブ */}
            {activeTab === 'transactions' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">日付</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">案件名</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">クライアント</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">金額</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">手数料</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">受取額</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">状態</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-gray-900">{transaction.projectTitle}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.client}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-red-600">
                            -{formatCurrency(transaction.fee)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(transaction.netAmount)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(transaction.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ページネーション */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-700">
                    全 {transactions.length} 件
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                      前へ
                    </button>
                    <button className="px-3 py-1 bg-[#ff6232] text-white rounded-md">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                      次へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 出金履歴タブ */}
            {activeTab === 'withdrawals' && (
              <div>
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b]"
                  >
                    出金申請
                  </button>
                </div>

                <div className="space-y-4">
                  {withdrawalHistory.map((withdrawal) => (
                    <div key={withdrawal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(withdrawal.amount)}
                            </p>
                            {getStatusBadge(withdrawal.status)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>申請日: {new Date(withdrawal.requestDate).toLocaleDateString('ja-JP')}</p>
                            {withdrawal.completeDate && (
                              <p>完了日: {new Date(withdrawal.completeDate).toLocaleDateString('ja-JP')}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {withdrawal.method === 'bank' && withdrawal.bankInfo && (
                            <div className="text-sm text-gray-600">
                              <p>{withdrawal.bankInfo.bankName}</p>
                              <p>口座番号: {withdrawal.bankInfo.accountNumber}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 出金方法設定 */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">登録済み出金方法</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">銀行振込</p>
                          <p className="text-sm text-gray-600">三菱UFJ銀行 ****1234</p>
                        </div>
                      </div>
                      <button className="text-sm text-[#ff6232] hover:underline">編集</button>
                    </div>
                  </div>
                  <button className="mt-4 text-sm text-[#ff6232] hover:underline">
                    + 出金方法を追加
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 出金申請モーダル */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">出金申請</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出金可能額: {formatCurrency(earningsData.availableBalance)}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={earningsData.availableBalance}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                    placeholder="出金額を入力"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出金方法
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as 'bank' | 'paypal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                >
                  <option value="bank">銀行振込（三菱UFJ銀行 ****1234）</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <p className="font-medium mb-1">注意事項</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>最低出金額は¥1,000です</li>
                  <li>出金手数料は¥250です</li>
                  <li>通常2-3営業日で振り込まれます</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleWithdraw}
                className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b]"
              >
                申請する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}