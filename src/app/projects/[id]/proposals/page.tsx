'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Proposal {
  id: string
  creatorId: string
  creatorName: string
  creatorAvatar: string
  creatorRating: number
  creatorCompletedProjects: number
  amount: number
  deliveryDays: number
  message: string
  portfolioItems: {
    id: string
    title: string
    url: string
  }[]
  attachments?: {
    name: string
    size: number
  }[]
  submittedAt: string
  status: 'pending' | 'accepted' | 'rejected'
  isShortlisted: boolean
}

interface Project {
  id: string
  title: string
  category: string
  budget: {
    min: number
    max: number
  }
  deadline: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
}

export default function ProposalsListPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'shortlisted' | 'pending' | 'accepted' | 'rejected'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest')
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchProjectAndProposals()
  }, [projectId])

  const fetchProjectAndProposals = async () => {
    setLoading(true)
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      // プロジェクト情報（モックデータ）
      setProject({
        id: projectId,
        title: 'アイドルグループ新曲のアレンジ制作',
        category: 'arrangement',
        budget: {
          min: 50000,
          max: 100000
        },
        deadline: '2025-05-15',
        status: 'open'
      })

      // 提案リスト（モックデータ）
      const mockProposals: Proposal[] = [
        {
          id: '1',
          creatorId: 'creator1',
          creatorName: '山田太郎',
          creatorAvatar: '/avatar1.jpg',
          creatorRating: 4.8,
          creatorCompletedProjects: 32,
          amount: 75000,
          deliveryDays: 14,
          message: 'はじめまして。私は10年以上の音楽制作経験があり、特にアイドル楽曲のアレンジを得意としています。今回のご依頼について、明るくキャッチーなメロディラインを活かしたアレンジをご提案させていただきます。',
          portfolioItems: [
            { id: 'p1', title: 'アイドル楽曲アレンジサンプル', url: '#' },
            { id: 'p2', title: 'ポップス編曲作品', url: '#' }
          ],
          attachments: [
            { name: 'portfolio.pdf', size: 2500000 }
          ],
          submittedAt: '2025-04-20T10:00:00Z',
          status: 'pending',
          isShortlisted: true
        },
        {
          id: '2',
          creatorId: 'creator2',
          creatorName: '鈴木花子',
          creatorAvatar: '/avatar2.jpg',
          creatorRating: 4.9,
          creatorCompletedProjects: 45,
          amount: 68000,
          deliveryDays: 10,
          message: '音楽制作スタジオを運営しており、プロのチームでアレンジを担当させていただきます。',
          portfolioItems: [
            { id: 'p3', title: 'スタジオ制作実績', url: '#' }
          ],
          submittedAt: '2025-04-19T15:30:00Z',
          status: 'pending',
          isShortlisted: true
        },
        {
          id: '3',
          creatorId: 'creator3',
          creatorName: '佐藤次郎',
          creatorAvatar: '/avatar3.jpg',
          creatorRating: 4.5,
          creatorCompletedProjects: 18,
          amount: 85000,
          deliveryDays: 20,
          message: 'ストリングスアレンジを得意としています。',
          portfolioItems: [],
          submittedAt: '2025-04-21T09:00:00Z',
          status: 'pending',
          isShortlisted: false
        }
      ]
      setProposals(mockProposals)
      setLoading(false)
    }, 1000)
  }

  // フィルタリングとソート
  const filteredAndSortedProposals = proposals
    .filter(proposal => {
      switch (filter) {
        case 'all':
          return true
        case 'shortlisted':
          return proposal.isShortlisted
        case 'pending':
        case 'accepted':
        case 'rejected':
          return proposal.status === filter
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case 'price_low':
          return a.amount - b.amount
        case 'price_high':
          return b.amount - a.amount
        case 'rating':
          return b.creatorRating - a.creatorRating
        default:
          return 0
      }
    })

  const handleAcceptProposal = (proposalId: string) => {
    if (confirm('この提案を採用しますか？')) {
      // TODO: API呼び出し
      setProposals(prev => prev.map(p => ({
        ...p,
        status: p.id === proposalId ? 'accepted' : p.status === 'accepted' ? 'pending' : p.status
      })))
      alert('提案を採用しました。')
    }
  }

  const toggleShortlist = (proposalId: string) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId ? { ...p, isShortlisted: !p.isShortlisted } : p
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
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
          <span className="text-gray-900">提案一覧</span>
        </nav>

        {/* 案件情報サマリー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{project?.title}</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>予算: ¥{project?.budget.min.toLocaleString()} - ¥{project?.budget.max.toLocaleString()}</span>
                <span>納期: {project?.deadline && formatDate(project.deadline)}</span>
                <span className="font-medium text-[#ff6232]">提案数: {proposals.length}件</span>
              </div>
            </div>
            <Link
              href={`/dashboard/client/projects/${projectId}`}
              className="px-4 py-2 text-[#ff6232] hover:text-[#ff8a5b]"
            >
              案件詳細 →
            </Link>
          </div>
        </div>

        {/* フィルターとソート */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-600">
                全提案: <span className="font-medium text-gray-900">{proposals.length}件</span>
              </span>
              <span className="text-gray-600">
                候補: <span className="font-medium text-[#ff6232]">
                  {proposals.filter(p => p.isShortlisted).length}件
                </span>
              </span>
            </div>

            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
              >
                <option value="all">すべて</option>
                <option value="shortlisted">候補のみ</option>
                <option value="pending">検討中</option>
                <option value="accepted">採用済み</option>
                <option value="rejected">不採用</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232]"
              >
                <option value="newest">新しい順</option>
                <option value="price_low">価格が安い順</option>
                <option value="price_high">価格が高い順</option>
                <option value="rating">評価が高い順</option>
              </select>
            </div>
          </div>
        </div>

        {/* 提案リスト */}
        <div className="space-y-4">
          {filteredAndSortedProposals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">該当する提案がありません</p>
            </div>
          ) : (
            filteredAndSortedProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{proposal.creatorName}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center">
                              ⭐ {proposal.creatorRating}
                            </span>
                            <span>完了案件: {proposal.creatorCompletedProjects}件</span>
                            <span>提案日: {formatDate(proposal.submittedAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {proposal.isShortlisted && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              候補
                            </span>
                          )}
                          {proposal.status === 'accepted' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              採用
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{proposal.message}</p>

                      <div className="flex items-center space-x-6 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">提案金額:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            ¥{proposal.amount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">作業日数:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {proposal.deliveryDays}日
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {proposal.status === 'pending' && (
                          <>
                            <button
                              onClick={() => toggleShortlist(proposal.id)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                proposal.isShortlisted
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {proposal.isShortlisted ? '候補から外す' : '候補に追加'}
                            </button>
                            
                            <button
                              onClick={() => handleAcceptProposal(proposal.id)}
                              className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b] transition-colors"
                            >
                              採用する
                            </button>
                          </>
                        )}
                        
                        <Link
                          href={`/dashboard/messages?projectId=${projectId}&creatorId=${proposal.creatorId}`}
                          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          メッセージ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}