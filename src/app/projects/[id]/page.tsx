'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  client: {
    id: string
    name: string
    avatar: string
    rating: number
    completedProjects: number
  }
  description: string
  requirements: {
    genre?: string
    duration?: number
    revisions?: number
    deliveryFormat?: string
  }
  budget: {
    min: number
    max: number
  }
  deadline: string
  proposalsCount: number
  createdAt: string
  attachments?: {
    id: string
    name: string
    url: string
    size: number
  }[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'proposals' | 'qa'>('details')

  useEffect(() => {
    // TODO: 実際のAPI呼び出しに置き換える
    const fetchProject = async () => {
      setLoading(true)
      // モックデータ
      setTimeout(() => {
        setProject({
          id: params.id as string,
          title: 'アイドルグループ新曲のアレンジ制作',
          category: 'arrangement',
          status: 'open',
          client: {
            id: '1',
            name: 'RINGAX Records',
            avatar: '/avatar-placeholder.png',
            rating: 4.8,
            completedProjects: 23
          },
          description: `新人アイドルグループの2ndシングルのアレンジを担当していただける方を探しています。

楽曲のイメージ：
- 明るくポップな雰囲気
- テンポ: 128-132 BPM
- 参考楽曲: ○○の「△△」のような雰囲気

必要な要素：
- イントロ、Aメロ、Bメロ、サビ、間奏、アウトロの構成
- ストリングスとブラスセクションのアレンジ
- 生楽器の雰囲気を重視

納品形式：
- Logic Pro Xのプロジェクトファイル
- 各パートのステムファイル（WAV 48kHz/24bit）`,
          requirements: {
            genre: 'J-POP',
            duration: 240,
            revisions: 3,
            deliveryFormat: 'Logic Pro X, WAV'
          },
          budget: {
            min: 50000,
            max: 100000
          },
          deadline: '2025-05-15',
          proposalsCount: 8,
          createdAt: '2025-04-01T10:00:00Z',
          attachments: [
            {
              id: '1',
              name: 'demo_vocal.mp3',
              url: '#',
              size: 3500000
            },
            {
              id: '2',
              name: '参考楽曲リスト.pdf',
              url: '#',
              size: 250000
            }
          ]
        })
        setLoading(false)
      }, 1000)
    }

    fetchProject()
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: '募集中', className: 'bg-green-100 text-green-800' },
      in_progress: { label: '進行中', className: 'bg-blue-100 text-blue-800' },
      completed: { label: '完了', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'キャンセル', className: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      composition: '作曲',
      arrangement: 'アレンジ',
      lyrics: '作詞',
      mixing: 'ミキシング',
      mastering: 'マスタリング',
      recording: 'レコーディング'
    }
    return categories[category] || category
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
          <Link href="/dashboard/creator" className="mt-4 inline-block text-[#ff6232] hover:underline">
            ダッシュボードに戻る
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
                <Link href="/projects" className="text-gray-700 hover:text-[#ff6232]">
                  案件を探す
                </Link>
                <Link href="/creators" className="text-gray-700 hover:text-[#ff6232]">
                  クリエーター
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
          <Link href="/dashboard/creator" className="text-gray-500 hover:text-gray-700">
            ダッシュボード
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/projects" className="text-gray-500 hover:text-gray-700">
            案件一覧
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{project.title}</span>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：メイン情報 */}
          <div className="lg:col-span-2">
            {/* タイトルセクション */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(project.status)}
                    <span className="text-sm text-gray-500">
                      カテゴリー: {getCategoryLabel(project.category)}
                    </span>
                    <span className="text-sm text-gray-500">
                      投稿: {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 予算と納期 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">予算</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ¥{project.budget.min.toLocaleString()} - ¥{project.budget.max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">納期</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(project.deadline)}
                  </p>
                </div>
              </div>
            </div>

            {/* タブナビゲーション */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'details'
                        ? 'border-[#ff6232] text-[#ff6232]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    詳細
                  </button>
                  <button
                    onClick={() => setActiveTab('proposals')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'proposals'
                        ? 'border-[#ff6232] text-[#ff6232]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    提案 ({project.proposalsCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('qa')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'qa'
                        ? 'border-[#ff6232] text-[#ff6232]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Q&A
                  </button>
                </nav>
              </div>

              {/* タブコンテンツ */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div>
                    {/* 詳細説明 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">案件の詳細</h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                        {project.description}
                      </div>
                    </div>

                    {/* 要件 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">要件</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.requirements.genre && (
                          <div>
                            <dt className="text-sm text-gray-500">ジャンル</dt>
                            <dd className="mt-1 text-gray-900">{project.requirements.genre}</dd>
                          </div>
                        )}
                        {project.requirements.duration && (
                          <div>
                            <dt className="text-sm text-gray-500">楽曲の長さ</dt>
                            <dd className="mt-1 text-gray-900">
                              約{Math.floor(project.requirements.duration / 60)}分{project.requirements.duration % 60}秒
                            </dd>
                          </div>
                        )}
                        {project.requirements.revisions && (
                          <div>
                            <dt className="text-sm text-gray-500">修正回数</dt>
                            <dd className="mt-1 text-gray-900">{project.requirements.revisions}回まで</dd>
                          </div>
                        )}
                        {project.requirements.deliveryFormat && (
                          <div>
                            <dt className="text-sm text-gray-500">納品形式</dt>
                            <dd className="mt-1 text-gray-900">{project.requirements.deliveryFormat}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {/* 添付ファイル */}
                    {project.attachments && project.attachments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">添付ファイル</h3>
                        <div className="space-y-2">
                          {project.attachments.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <button className="text-[#ff6232] hover:text-[#ff8a5b] text-sm font-medium">
                                ダウンロード
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'proposals' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">現在{project.proposalsCount}件の提案があります</p>
                    <p className="text-sm text-gray-400">※クライアントのみ提案を閲覧できます</p>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">まだ質問はありません</p>
                    <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      質問する
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右側：サイドバー */}
          <div>
            {/* クライアント情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クライアント情報</h3>
              <div className="flex items-start space-x-4 mb-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{project.client.name}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(project.client.rating) ? 'fill-current' : 'fill-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{project.client.rating}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">完了案件数</span>
                  <span className="text-gray-900">{project.client.completedProjects}件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">評価</span>
                  <span className="text-gray-900">★ {project.client.rating}</span>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                プロフィールを見る
              </button>
            </div>

            {/* アクションボタン */}
            {project.status === 'open' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Link
                  href={`/projects/${project.id}/proposal`}
                  className="block w-full px-6 py-3 bg-[#ff6232] text-white text-center font-medium rounded-lg hover:bg-[#ff8a5b] transition-colors mb-3"
                >
                  提案を作成する
                </Link>
                <button className="w-full px-6 py-3 bg-white text-[#ff6232] border border-[#ff6232] font-medium rounded-lg hover:bg-orange-50 transition-colors">
                  お気に入りに追加
                </button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  応募締切まであと{Math.floor((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日
                </p>
              </div>
            )}

            {/* 統計情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">案件の統計</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">提案数</span>
                    <span className="text-gray-900 font-medium">{project.proposalsCount}件</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#ff6232] h-2 rounded-full" 
                      style={{width: `${Math.min(project.proposalsCount * 10, 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">閲覧数</span>
                  <span className="text-gray-900">156回</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">お気に入り</span>
                  <span className="text-gray-900">23件</span>
                </div>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
              <h4 className="font-medium text-orange-900 mb-2">注意事項</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 提案前に要件をよく確認してください</li>
                <li>• 納期は厳守でお願いします</li>
                <li>• 著作権の取り扱いにご注意ください</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}