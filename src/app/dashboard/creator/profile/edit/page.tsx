'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProfileData {
  name: string
  email: string
  avatar: string | null
  bio: string
  skills: string[]
  portfolio_url: string
  hourly_rate_min: number
  hourly_rate_max: number
  genres: string[]
  tools: string[]
  experience_years: number
  availability: 'full_time' | 'part_time' | 'project_basis'
}

export default function CreatorProfileEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'portfolio'>('basic')
  
  // プロフィールデータの初期値（実際はAPIから取得）
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '山田 太郎',
    email: 'creator@example.com',
    avatar: null,
    bio: 'プロのアレンジャーとして10年以上の経験があります。J-POP、アニソン、劇伴音楽を得意としています。',
    skills: ['作曲', 'アレンジ', 'ミキシング'],
    portfolio_url: 'https://soundcloud.com/yamada',
    hourly_rate_min: 5000,
    hourly_rate_max: 15000,
    genres: ['J-POP', 'アニソン', '劇伴'],
    tools: ['Logic Pro X', 'Cubase', 'Pro Tools'],
    experience_years: 10,
    availability: 'project_basis'
  })

  const [newSkill, setNewSkill] = useState('')
  const [newGenre, setNewGenre] = useState('')
  const [newTool, setNewTool] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }))
  }

  const addSkill = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addGenre = () => {
    if (newGenre && !profileData.genres.includes(newGenre)) {
      setProfileData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre]
      }))
      setNewGenre('')
    }
  }

  const removeGenre = (genre: string) => {
    setProfileData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }))
  }

  const addTool = () => {
    if (newTool && !profileData.tools.includes(newTool)) {
      setProfileData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool]
      }))
      setNewTool('')
    }
  }

  const removeTool = (tool: string) => {
    setProfileData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: APIを呼び出してプロフィールを更新
    setTimeout(() => {
      setLoading(false)
      alert('プロフィールを更新しました')
      router.push('/creator/dashboard')
    }, 1000)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: 実際にはファイルをアップロード
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          avatar: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
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
                <Link href="/dashboard/creator" className="text-gray-700 hover:text-[#ff6232]">
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
          <span className="text-gray-900">プロフィール編集</span>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-sm">
          {/* タブナビゲーション */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'basic'
                    ? 'border-[#ff6232] text-[#ff6232]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                基本情報
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'skills'
                    ? 'border-[#ff6232] text-[#ff6232]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                スキル・専門分野
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'portfolio'
                    ? 'border-[#ff6232] text-[#ff6232]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ポートフォリオ・料金
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* 基本情報タブ */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* アバター */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    プロフィール画像
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-full overflow-hidden">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        画像を選択
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG（最大5MB）</p>
                    </div>
                  </div>
                </div>

                {/* 名前 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    表示名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  />
                </div>

                {/* 自己紹介 */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    自己紹介
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                    placeholder="あなたの経験、得意分野、制作スタイルなどを記入してください"
                  />
                  <p className="text-sm text-gray-500 mt-1">最大500文字</p>
                </div>

                {/* 稼働状況 */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    稼働状況
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={profileData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  >
                    <option value="full_time">フルタイム対応可能</option>
                    <option value="part_time">パートタイム対応可能</option>
                    <option value="project_basis">案件ごとに相談</option>
                  </select>
                </div>
              </div>
            )}

            {/* スキル・専門分野タブ */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* スキル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    スキル
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 bg-[#ff6232] bg-opacity-10 text-[#ff6232] rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="スキルを追加"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b]"
                    >
                      追加
                    </button>
                  </div>
                </div>

                {/* 得意ジャンル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    得意ジャンル
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => removeGenre(genre)}
                          className="ml-2 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      placeholder="ジャンルを追加"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addGenre()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addGenre}
                      className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b]"
                    >
                      追加
                    </button>
                  </div>
                </div>

                {/* 使用ツール */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用ツール・DAW
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => removeTool(tool)}
                          className="ml-2 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="ツールを追加"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTool()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addTool}
                      className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b]"
                    >
                      追加
                    </button>
                  </div>
                </div>

                {/* 経験年数 */}
                <div>
                  <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                    音楽制作経験年数
                  </label>
                  <input
                    type="number"
                    id="experience_years"
                    name="experience_years"
                    value={profileData.experience_years}
                    onChange={handleNumberChange}
                    min="0"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* ポートフォリオ・料金タブ */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* ポートフォリオURL */}
                <div>
                  <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700 mb-2">
                    ポートフォリオURL
                  </label>
                  <input
                    type="url"
                    id="portfolio_url"
                    name="portfolio_url"
                    value={profileData.portfolio_url}
                    onChange={handleInputChange}
                    placeholder="https://soundcloud.com/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">SoundCloud、YouTube、個人サイトなど</p>
                </div>

                {/* 時給範囲 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    希望時給範囲
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hourly_rate_min" className="block text-xs text-gray-500 mb-1">
                        最小時給
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                        <input
                          type="number"
                          id="hourly_rate_min"
                          name="hourly_rate_min"
                          value={profileData.hourly_rate_min}
                          onChange={handleNumberChange}
                          min="0"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hourly_rate_max" className="block text-xs text-gray-500 mb-1">
                        最大時給
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                        <input
                          type="number"
                          id="hourly_rate_max"
                          name="hourly_rate_max"
                          value={profileData.hourly_rate_max}
                          onChange={handleNumberChange}
                          min="0"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">案件の規模や内容により相談可能</p>
                </div>

                {/* 実績サンプル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    実績サンプル
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      音源ファイルをドラッグ＆ドロップ
                    </p>
                    <p className="text-xs text-gray-500">
                      または
                    </p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      ファイルを選択
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      MP3, WAV（最大50MB × 5ファイル）
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ボタン */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Link
                href="/creator/dashboard"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#ff6232] text-white hover:bg-[#ff8a5b]'
                }`}
              >
                {loading ? '保存中...' : 'プロフィールを更新'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}