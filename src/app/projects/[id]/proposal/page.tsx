'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  client: {
    name: string
    avatar: string
  }
  budget: {
    min: number
    max: number
  }
  deadline: string
  description: string
  requirements: {
    genre?: string
    duration?: number
    revisions?: number
  }
}

interface PortfolioItem {
  id: string
  title: string
  url: string
  description: string
}

export default function ProposalCreatePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // フォーム状態
  const [proposalAmount, setProposalAmount] = useState('')
  const [deliveryDays, setDeliveryDays] = useState('')
  const [message, setMessage] = useState('')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<string[]>([])
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

  // バリデーションエラー
  const [errors, setErrors] = useState<{
    amount?: string
    deliveryDays?: string
    message?: string
  }>({})

  useEffect(() => {
    // プロジェクト情報を取得（モック）
    fetchProject()
    // ポートフォリオ情報を取得（モック）
    fetchPortfolio()
  }, [projectId])

  const fetchProject = async () => {
    setLoading(true)
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      setProject({
        id: projectId,
        title: 'アイドルグループ新曲のアレンジ制作',
        category: 'arrangement',
        client: {
          name: 'RINGAX Records',
          avatar: '/avatar-placeholder.png'
        },
        budget: {
          min: 50000,
          max: 100000
        },
        deadline: '2025-05-15',
        description: `新人アイドルグループの2ndシングルのアレンジを担当していただける方を探しています。

楽曲のイメージ：
- 明るくポップな雰囲気
- テンポ: 128-132 BPM
- 参考楽曲: ○○の「△△」のような雰囲気`,
        requirements: {
          genre: 'J-POP',
          duration: 240,
          revisions: 3
        }
      })
      setLoading(false)
    }, 1000)
  }

  const fetchPortfolio = async () => {
    // クリエーターのポートフォリオを取得（モック）
    setTimeout(() => {
      setPortfolioItems([
        {
          id: '1',
          title: 'ポップス楽曲アレンジサンプル',
          url: 'https://soundcloud.com/sample1',
          description: '明るいポップス調のアレンジです'
        },
        {
          id: '2',
          title: 'バンドアレンジ作品',
          url: 'https://youtube.com/sample2',
          description: 'ロックバンド編成のアレンジ'
        },
        {
          id: '3',
          title: 'アイドル楽曲制作実績',
          url: 'https://soundcloud.com/sample3',
          description: '過去に制作したアイドル楽曲'
        }
      ])
    }, 500)
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // 金額バリデーション
    const amount = parseInt(proposalAmount)
    if (!proposalAmount) {
      newErrors.amount = '提案金額を入力してください'
    } else if (isNaN(amount)) {
      newErrors.amount = '有効な金額を入力してください'
    } else if (project && (amount < project.budget.min || amount > project.budget.max)) {
      newErrors.amount = `予算範囲内（¥${project.budget.min.toLocaleString()} - ¥${project.budget.max.toLocaleString()}）で入力してください`
    }

    // 納期バリデーション
    const days = parseInt(deliveryDays)
    if (!deliveryDays) {
      newErrors.deliveryDays = '作業日数を入力してください'
    } else if (isNaN(days) || days < 1) {
      newErrors.deliveryDays = '有効な日数を入力してください'
    }

    // メッセージバリデーション
    if (!message.trim()) {
      newErrors.message = '提案メッセージを入力してください'
    } else if (message.length < 50) {
      newErrors.message = 'メッセージは50文字以上入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      alert('提案を送信しました！')
      router.push(`/projects/${projectId}`)
    }, 1500)
  }

  const handlePortfolioToggle = (id: string) => {
    setSelectedPortfolioIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイルサイズチェック（10MB以下）
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズは10MB以下にしてください')
        return
      }
      setAttachmentFile(file)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">案件が見つかりませんでした</p>
          <Link href="/search" className="mt-4 inline-block text-[#ff6232] hover:underline">
            案件検索に戻る
          </Link>
        </div>
      </div>
    )
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
                <Link href="/search" className="text-gray-700 hover:text-[#ff6232]">
                  案件を探す
                </Link>
                <Link href="/my-proposals" className="text-gray-700 hover:text-[#ff6232]">
                  提案管理
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
          <Link href="/search" className="text-gray-500 hover:text-gray-700">
            案件検索
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/projects/${projectId}`} className="text-gray-500 hover:text-gray-700">
            {project.title}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">提案作成</span>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：提案フォーム */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">提案を作成</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 提案金額 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提案金額 *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ¥
                    </span>
                    <input
                      type="text"
                      value={proposalAmount}
                      onChange={(e) => setProposalAmount(e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent`}
                      placeholder="50000"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    予算範囲: ¥{project.budget.min.toLocaleString()} - ¥{project.budget.max.toLocaleString()}
                  </p>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* 作業日数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作業日数 *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                      className={`flex-1 px-3 py-2 border ${errors.deliveryDays ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent`}
                      placeholder="14"
                    />
                    <span className="text-gray-700">日</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    納期: {formatDate(project.deadline)}までに納品
                  </p>
                  {errors.deliveryDays && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryDays}</p>
                  )}
                </div>

                {/* 提案メッセージ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提案メッセージ *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className={`w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent`}
                    placeholder="はじめまして。私は〇〇年の音楽制作経験があり、特にアイドル楽曲のアレンジを得意としています。

今回のご依頼について、以下のような提案をさせていただきます：

1. 制作アプローチ
- 明るくキャッチーなメロディラインを活かしたアレンジ
- ストリングスとブラスセクションを効果的に配置

2. 納期について
- 初稿提出: 〇日以内
- 修正対応: 〇日以内

3. 過去の実績
- 類似ジャンルの制作実績が〇件あります

よろしくお願いいたします。"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">
                      最低50文字以上入力してください
                    </p>
                    <p className={`text-sm ${message.length < 50 ? 'text-gray-400' : 'text-gray-600'}`}>
                      {message.length}文字
                    </p>
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* ポートフォリオ選択 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ポートフォリオを添付
                  </label>
                  <div className="space-y-2">
                    {portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPortfolioIds.includes(item.id)
                            ? 'border-[#ff6232] bg-orange-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePortfolioToggle(item.id)}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={selectedPortfolioIds.includes(item.id)}
                            onChange={() => {}}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#ff6232] hover:underline mt-1 inline-block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              作品を見る →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ファイル添付 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    追加ファイル
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.mp3,.wav,.zip"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        クリックしてファイルを選択
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, MP3, WAV, ZIP（最大10MB）
                      </p>
                    </label>
                    {attachmentFile && (
                      <div className="mt-4 p-2 bg-gray-50 rounded flex items-center justify-between">
                        <span className="text-sm text-gray-700">{attachmentFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachmentFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 送信ボタン */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link
                    href={`/projects/${projectId}`}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b] transition-colors ${
                      submitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? '送信中...' : '提案を送信'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 右側：案件情報サマリー */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">案件情報</h3>
              
              {/* クライアント情報 */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{project.client.name}</p>
                    <p className="text-sm text-gray-500">クライアント</p>
                  </div>
                </div>
              </div>

              {/* 案件詳細 */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">案件タイトル</p>
                  <p className="font-medium text-gray-900 mt-1">{project.title}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">カテゴリー</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {project.category === 'arrangement' ? 'アレンジ' : project.category}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">予算</p>
                  <p className="font-medium text-gray-900 mt-1">
                    ¥{project.budget.min.toLocaleString()} - ¥{project.budget.max.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">納期</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {formatDate(project.deadline)}
                  </p>
                </div>

                {project.requirements.genre && (
                  <div>
                    <p className="text-gray-500">ジャンル</p>
                    <p className="font-medium text-gray-900 mt-1">{project.requirements.genre}</p>
                  </div>
                )}

                {project.requirements.revisions && (
                  <div>
                    <p className="text-gray-500">修正回数</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {project.requirements.revisions}回まで
                    </p>
                  </div>
                )}
              </div>

              {/* 注意事項 */}
              <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-900 mb-1">提案時の注意</p>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• 提案は一度送信すると変更できません</li>
                  <li>• クライアントの返答までお待ちください</li>
                  <li>• 採用後のキャンセルは評価に影響します</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}