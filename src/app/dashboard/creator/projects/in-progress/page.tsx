'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface InProgressProject {
  id: string
  title: string
  category: string
  clientName: string
  clientAvatar?: string
  amount: number
  deliveryDays: number
  deadline: string
  startedAt: string
  status: 'in_progress' | 'submitted' | 'revision_requested' | 'completed'
  currentMilestone?: {
    name: string
    progress: number
  }
  deliverables?: {
    id: string
    name: string
    uploadedAt?: string
    status: 'pending' | 'uploaded' | 'approved' | 'rejected'
  }[]
  revisionCount: number
  maxRevisions: number
  messages: {
    unread: number
    lastMessageAt?: string
  }
}

export default function InProgressProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<InProgressProject[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'submitted' | 'revision_requested'>('all')
  const [sortBy, setSortBy] = useState<'deadline' | 'started' | 'amount'>('deadline')
  const [selectedProject, setSelectedProject] = useState<InProgressProject | null>(null)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [deliveryMessage, setDeliveryMessage] = useState('')

  useEffect(() => {
    fetchInProgressProjects()
  }, [])

  const fetchInProgressProjects = async () => {
    setLoading(true)
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      const mockProjects: InProgressProject[] = [
        {
          id: '1',
          title: 'アイドルグループ新曲のアレンジ制作',
          category: 'arrangement',
          clientName: 'RINGAX Records',
          amount: 75000,
          deliveryDays: 14,
          deadline: '2025-05-15',
          startedAt: '2025-05-01',
          status: 'in_progress',
          currentMilestone: {
            name: 'アレンジ制作',
            progress: 60
          },
          deliverables: [
            { id: 'd1', name: 'デモ音源', status: 'approved' },
            { id: 'd2', name: '完成版音源', status: 'pending' },
            { id: 'd3', name: 'ステムファイル', status: 'pending' }
          ],
          revisionCount: 0,
          maxRevisions: 3,
          messages: {
            unread: 2,
            lastMessageAt: '2025-05-03T14:30:00Z'
          }
        },
        {
          id: '2',
          title: 'CM用BGM制作',
          category: 'composition',
          clientName: '広告代理店ABC',
          amount: 50000,
          deliveryDays: 7,
          deadline: '2025-05-08',
          startedAt: '2025-05-01',
          status: 'submitted',
          currentMilestone: {
            name: '検収待ち',
            progress: 100
          },
          deliverables: [
            { id: 'd4', name: '15秒版', status: 'uploaded', uploadedAt: '2025-05-05T10:00:00Z' },
            { id: 'd5', name: '30秒版', status: 'uploaded', uploadedAt: '2025-05-05T10:00:00Z' }
          ],
          revisionCount: 1,
          maxRevisions: 2,
          messages: {
            unread: 0,
            lastMessageAt: '2025-05-05T10:30:00Z'
          }
        },
        {
          id: '3',
          title: '企業VP用楽曲制作',
          category: 'composition',
          clientName: '株式会社サンプル',
          amount: 100000,
          deliveryDays: 21,
          deadline: '2025-05-22',
          startedAt: '2025-05-01',
          status: 'revision_requested',
          currentMilestone: {
            name: '修正対応中',
            progress: 80
          },
          deliverables: [
            { id: 'd6', name: 'メイン楽曲', status: 'rejected', uploadedAt: '2025-05-10T15:00:00Z' }
          ],
          revisionCount: 1,
          maxRevisions: 3,
          messages: {
            unread: 1,
            lastMessageAt: '2025-05-11T09:00:00Z'
          }
        }
      ]
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }

  // フィルタリングとソート
  const filteredAndSortedProjects = projects
    .filter(project => {
      if (filter === 'all') return true
      return project.status === filter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'started':
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        case 'amount':
          return b.amount - a.amount
        default:
          return 0
      }
    })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_progress: { label: '進行中', className: 'bg-blue-100 text-blue-800' },
      submitted: { label: '検収待ち', className: 'bg-yellow-100 text-yellow-800' },
      revision_requested: { label: '修正依頼', className: 'bg-orange-100 text-orange-800' },
      completed: { label: '完了', className: 'bg-green-100 text-green-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return <span className="text-red-600 font-medium">期限超過</span>
    if (days === 0) return <span className="text-red-600 font-medium">本日締切</span>
    if (days <= 3) return <span className="text-orange-600 font-medium">残り{days}日</span>
    return <span className="text-gray-600">残り{days}日</span>
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDelivery = () => {
    if (!uploadedFile) {
      alert('納品ファイルを選択してください')
      return
    }
    // TODO: 実際のアップロード処理
    alert('納品を完了しました')
    setShowDeliveryModal(false)
    setUploadedFile(null)
    setDeliveryMessage('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'numeric',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">進行中の案件</h1>
          <p className="text-gray-600">受注した案件の進捗管理と納品を行います</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">進行中</p>
            <p className="text-2xl font-bold text-gray-900">
              {projects.filter(p => p.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">検収待ち</p>
            <p className="text-2xl font-bold text-yellow-600">
              {projects.filter(p => p.status === 'submitted').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">修正依頼</p>
            <p className="text-2xl font-bold text-orange-600">
              {projects.filter(p => p.status === 'revision_requested').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">今月の収益</p>
            <p className="text-2xl font-bold text-green-600">
              ¥{projects.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* フィルターとソート */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-[#ff6232] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて ({projects.length})
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'in_progress' 
                    ? 'bg-[#ff6232] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                進行中
              </button>
              <button
                onClick={() => setFilter('submitted')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'submitted' 
                    ? 'bg-[#ff6232] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                検収待ち
              </button>
              <button
                onClick={() => setFilter('revision_requested')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'revision_requested' 
                    ? 'bg-[#ff6232] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                修正依頼
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
            >
              <option value="deadline">納期が近い順</option>
              <option value="started">開始日が新しい順</option>
              <option value="amount">金額が高い順</option>
            </select>
          </div>
        </div>

        {/* 案件リスト */}
        <div className="space-y-4">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">該当する案件がありません</p>
            </div>
          ) : (
            filteredAndSortedProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>クライアント: {project.clientName}</span>
                          <span>¥{project.amount.toLocaleString()}</span>
                          {getDaysRemaining(project.deadline)}
                        </div>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>

                {/* 進捗バー */}
                {project.currentMilestone && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{project.currentMilestone.name}</span>
                      <span className="text-gray-900 font-medium">{project.currentMilestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#ff6232] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.currentMilestone.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 納品物ステータス */}
                {project.deliverables && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">納品物:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="flex items-center space-x-1 text-sm">
                          {deliverable.status === 'approved' && (
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {deliverable.status === 'uploaded' && (
                            <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          )}
                          {deliverable.status === 'rejected' && (
                            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          {deliverable.status === 'pending' && (
                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={
                            deliverable.status === 'approved' ? 'text-green-700' :
                            deliverable.status === 'uploaded' ? 'text-yellow-700' :
                            deliverable.status === 'rejected' ? 'text-red-700' :
                            'text-gray-500'
                          }>
                            {deliverable.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 情報バー */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">開始日:</span>
                      <span className="text-gray-900">{formatDate(project.startedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">納期:</span>
                      <span className="text-gray-900 font-medium">{formatDate(project.deadline)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">修正:</span>
                      <span className="text-gray-900">{project.revisionCount}/{project.maxRevisions}回</span>
                    </div>
                    {project.messages.unread > 0 && (
                      <div className="flex items-center space-x-1 text-[#ff6232]">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="font-medium">{project.messages.unread}件の未読</span>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center space-x-3">
                    {project.status === 'in_progress' && (
                      <button
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDeliveryModal(true)
                        }}
                        className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b] transition-colors"
                      >
                        納品する
                      </button>
                    )}
                    {project.status === 'revision_requested' && (
                      <button
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDeliveryModal(true)
                        }}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        修正版を納品
                      </button>
                    )}
                    <Link
                      href={`/dashboard/messages?projectId=${project.id}`}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      メッセージ
                    </Link>
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 納品モーダル */}
      {showDeliveryModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">納品する</h2>
                <button
                  onClick={() => {
                    setShowDeliveryModal(false)
                    setUploadedFile(null)
                    setDeliveryMessage('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">案件名</p>
                <p className="font-medium text-gray-900">{selectedProject.title}</p>
              </div>

              {/* ファイルアップロード */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  納品ファイル
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".mp3,.wav,.zip,.pdf"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    {uploadedFile ? (
                      <div>
                        <svg className="h-12 w-12 text-green-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-gray-900 font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600">クリックしてファイルを選択</p>
                        <p className="text-sm text-gray-500 mt-1">MP3, WAV, ZIP, PDF (最大500MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* メッセージ */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  納品メッセージ（任意）
                </label>
                <textarea
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
                  placeholder="納品物に関する説明や注意事項があれば記入してください"
                />
              </div>

              {/* 注意事項 */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">納品前の確認事項</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>納品物が要件を満たしているか確認してください</li>
                      <li>ファイル形式が正しいか確認してください</li>
                      <li>納品後はクライアントの検収を待ちます</li>
                      <li>修正依頼がある場合は{selectedProject.maxRevisions - selectedProject.revisionCount}回まで対応可能です</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ボタン */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeliveryModal(false)
                    setUploadedFile(null)
                    setDeliveryMessage('')
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelivery}
                  disabled={!uploadedFile}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    uploadedFile
                      ? 'bg-[#ff6232] text-white hover:bg-[#ff8a5b]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  納品を完了する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}