'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  budget: {
    min: number
    max: number
  }
  deadline: string
}

interface SelectedProposal {
  id: string
  creatorId: string
  creatorName: string
  amount: number
  deliveryDays: number
  message: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer'
  last4?: string
  brand?: string
  bankName?: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<SelectedProposal | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card')
  const [savedCards, setSavedCards] = useState<PaymentMethod[]>([])
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [isNewCard, setIsNewCard] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // フォーム入力
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  useEffect(() => {
    fetchPaymentData()
  }, [projectId])

  const fetchPaymentData = async () => {
    setLoading(true)
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      // モックデータ
      setProject({
        id: projectId,
        title: 'アイドルグループ新曲のアレンジ制作',
        category: 'arrangement',
        budget: { min: 50000, max: 100000 },
        deadline: '2025-05-15'
      })

      setSelectedProposal({
        id: 'proposal_1',
        creatorId: 'creator_1',
        creatorName: '山田太郎',
        amount: 75000,
        deliveryDays: 14,
        message: '高品質なアレンジをお届けします。'
      })

      setSavedCards([
        {
          id: 'card_1',
          type: 'card',
          last4: '4242',
          brand: 'Visa'
        },
        {
          id: 'card_2',
          type: 'card',
          last4: '5555',
          brand: 'Mastercard'
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const calculateFees = (amount: number) => {
    const platformFee = Math.floor(amount * 0.1) // 10%の手数料
    const tax = Math.floor((amount + platformFee) * 0.1) // 消費税10%
    const total = amount + platformFee + tax
    return { platformFee, tax, total }
  }

  const fees = selectedProposal ? calculateFees(selectedProposal.amount) : { platformFee: 0, tax: 0, total: 0 }

  const handlePayment = async () => {
    if (!agreedToTerms) {
      alert('利用規約に同意してください')
      return
    }

    if (paymentMethod === 'card' && !selectedCard && !isNewCard) {
      alert('支払い方法を選択してください')
      return
    }

    setProcessing(true)
    
    // TODO: Stripe APIとの連携
    setTimeout(() => {
      alert('決済が完了しました。エスクローで資金を保護しています。')
      router.push(`/dashboard/client/projects/${projectId}`)
    }, 2000)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '')
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setCardDetails({ ...cardDetails, number: formatted })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value
      setCardDetails({ ...cardDetails, expiry: formatted })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6232] mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* パンくず */}
        <nav className="flex text-sm mb-6">
          <Link href="/dashboard/client" className="text-gray-500 hover:text-gray-700">
            ダッシュボード
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/dashboard/client/projects" className="text-gray-500 hover:text-gray-700">
            案件管理
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/dashboard/client/projects/${projectId}`} className="text-gray-500 hover:text-gray-700">
            {project?.title}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">決済</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">決済手続き</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：決済フォーム */}
          <div className="lg:col-span-2 space-y-6">
            {/* 支払い方法選択 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">支払い方法</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">クレジットカード</span>
                    <p className="text-sm text-gray-500">Visa, Mastercard, American Express, JCB</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">銀行振込</span>
                    <p className="text-sm text-gray-500">振込手数料はお客様負担となります</p>
                  </div>
                </label>
              </div>
            </div>

            {/* クレジットカード情報 */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">カード情報</h3>
                
                {/* 保存済みカード */}
                {savedCards.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">保存済みのカード</p>
                    <div className="space-y-2">
                      {savedCards.map((card) => (
                        <label key={card.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="savedCard"
                            value={card.id}
                            checked={selectedCard === card.id && !isNewCard}
                            onChange={(e) => {
                              setSelectedCard(e.target.value)
                              setIsNewCard(false)
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <span className="font-medium">{card.brand} ****{card.last4}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 新しいカード追加 */}
                <label className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="savedCard"
                    checked={isNewCard}
                    onChange={() => {
                      setIsNewCard(true)
                      setSelectedCard('')
                    }}
                    className="mr-3"
                  />
                  <span className="font-medium">新しいカードを追加</span>
                </label>

                {isNewCard && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        カード番号
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          有効期限
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          セキュリティコード
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                          maxLength={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        カード名義人
                      </label>
                      <input
                        type="text"
                        placeholder="TARO YAMADA"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 銀行振込情報 */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">振込先情報</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="font-medium text-gray-600 w-24">銀行名:</dt>
                      <dd className="text-gray-900">みずほ銀行</dd>
                    </div>
                    <div className="flex">
                      <dt className="font-medium text-gray-600 w-24">支店名:</dt>
                      <dd className="text-gray-900">渋谷支店</dd>
                    </div>
                    <div className="flex">
                      <dt className="font-medium text-gray-600 w-24">口座種別:</dt>
                      <dd className="text-gray-900">普通</dd>
                    </div>
                    <div className="flex">
                      <dt className="font-medium text-gray-600 w-24">口座番号:</dt>
                      <dd className="text-gray-900">1234567</dd>
                    </div>
                    <div className="flex">
                      <dt className="font-medium text-gray-600 w-24">口座名義:</dt>
                      <dd className="text-gray-900">カ）リンガックス</dd>
                    </div>
                  </dl>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  ※ 振込手数料はお客様のご負担となります<br />
                  ※ 振込確認後、1営業日以内に案件を開始いたします
                </p>
              </div>
            )}

            {/* 利用規約同意 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-700">
                  <Link href="/terms" className="text-[#ff6232] hover:underline">利用規約</Link>
                  および
                  <Link href="/escrow-terms" className="text-[#ff6232] hover:underline">エスクロー決済規約</Link>
                  に同意します
                </span>
              </label>
            </div>
          </div>

          {/* 右側：注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">注文内容</h2>
              
              {/* 案件情報 */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">{project?.title}</h3>
                <p className="text-sm text-gray-600">
                  クリエーター: {selectedProposal?.creatorName}
                </p>
                <p className="text-sm text-gray-600">
                  作業日数: {selectedProposal?.deliveryDays}日
                </p>
              </div>

              {/* 料金明細 */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">制作費</span>
                  <span className="text-gray-900">¥{selectedProposal?.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">サービス手数料（10%）</span>
                  <span className="text-gray-900">¥{fees.platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">消費税（10%）</span>
                  <span className="text-gray-900">¥{fees.tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">合計</span>
                    <span className="font-semibold text-gray-900 text-xl">
                      ¥{fees.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* エスクロー説明 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">エスクロー決済で安心</p>
                    <p className="text-blue-700">
                      お支払いいただいた代金は、納品・検収が完了するまでCreaxが安全にお預かりします。
                    </p>
                  </div>
                </div>
              </div>

              {/* 決済ボタン */}
              <button
                onClick={handlePayment}
                disabled={processing || !agreedToTerms}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                  processing || !agreedToTerms
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#ff6232] text-white hover:bg-[#ff8a5b]'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    処理中...
                  </span>
                ) : paymentMethod === 'card' ? (
                  '支払いを確定'
                ) : (
                  '振込情報を確認して完了'
                )}
              </button>

              {/* セキュリティバッジ */}
              <div className="mt-4 flex items-center justify-center space-x-4">
                <img src="/stripe-badge.png" alt="Stripe" className="h-8" />
                <div className="text-xs text-gray-500">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    SSL暗号化通信
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}