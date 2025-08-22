'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: 基本情報
    title: '',
    category: '',
    description: '',
    // Step 2: 詳細設定
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    deliveryFormat: [] as string[],
    revisions: '2',
    // Step 3: 参考ファイル
    referenceFiles: [] as File[],
    referenceUrl: '',
    isPrivate: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'composition', label: '作曲' },
    { value: 'arrangement', label: 'アレンジ' },
    { value: 'mixing', label: 'ミックス' },
    { value: 'mastering', label: 'マスタリング' },
    { value: 'recording', label: 'レコーディング' },
    { value: 'lyrics', label: '作詞' },
  ];

  const deliveryFormats = [
    { value: 'wav', label: 'WAV（高音質）' },
    { value: 'mp3', label: 'MP3（圧縮）' },
    { value: 'stems', label: 'パラデータ' },
    { value: 'midi', label: 'MIDIデータ' },
    { value: 'score', label: '楽譜' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFormatChange = (format: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryFormat: prev.deliveryFormat.includes(format)
        ? prev.deliveryFormat.filter(f => f !== format)
        : [...prev.deliveryFormat, format]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'タイトルを入力してください';
      }
      if (!formData.category) {
        newErrors.category = 'カテゴリーを選択してください';
      }
      if (!formData.description.trim()) {
        newErrors.description = '詳細説明を入力してください';
      } else if (formData.description.length < 50) {
        newErrors.description = '詳細説明は50文字以上で入力してください';
      }
    } else if (step === 2) {
      if (!formData.budgetMin) {
        newErrors.budgetMin = '最小予算を入力してください';
      }
      if (!formData.budgetMax) {
        newErrors.budgetMax = '最大予算を入力してください';
      }
      if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
        newErrors.budgetMax = '最大予算は最小予算より大きくしてください';
      }
      if (!formData.deadline) {
        newErrors.deadline = '納期を選択してください';
      }
      if (formData.deliveryFormat.length === 0) {
        newErrors.deliveryFormat = '納品形式を少なくとも1つ選択してください';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    
    setIsLoading(true);
    
    // TODO: 実際のAPI送信処理
    setTimeout(() => {
      setIsLoading(false);
      alert('案件を作成しました！');
      router.push('/dashboard/client');
    }, 1500);
  };

  const stepIndicator = (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep >= step 
              ? 'bg-creax-orange text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-24 h-1 mx-2 ${
              currentStep > step ? 'bg-creax-orange' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Creax"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <Link 
              href="/dashboard/client" 
              className="text-gray-600 hover:text-gray-900"
            >
              ✕ 閉じる
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">案件を作成</h1>
        <p className="text-gray-600 mb-8">音楽制作の依頼内容を入力してください</p>

        {stepIndicator}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* Step 1: 基本情報 */}
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-semibold mb-6">Step 1: 基本情報</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      案件タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="例：YouTubeチャンネル用BGM制作"
                      className={`w-full px-3 py-2 border ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリー <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                    >
                      <option value="">選択してください</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      詳細説明 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="制作してほしい音楽の詳細を記入してください。
・曲の雰囲気やイメージ
・使用用途
・参考にしたい楽曲
・その他の要望"
                      className={`w-full px-3 py-2 border ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        最低50文字以上
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.description.length} / 2000
                      </p>
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: 詳細設定 */}
            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-6">Step 2: 詳細設定</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      予算範囲 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        name="budgetMin"
                        value={formData.budgetMin}
                        onChange={handleInputChange}
                        placeholder="10000"
                        className={`flex-1 px-3 py-2 border ${
                          errors.budgetMin ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                      />
                      <span className="text-gray-500">〜</span>
                      <input
                        type="number"
                        name="budgetMax"
                        value={formData.budgetMax}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className={`flex-1 px-3 py-2 border ${
                          errors.budgetMax ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                      />
                      <span className="text-gray-700">円</span>
                    </div>
                    {(errors.budgetMin || errors.budgetMax) && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.budgetMin || errors.budgetMax}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      納期 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border ${
                        errors.deadline ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                    />
                    {errors.deadline && (
                      <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      納品形式 <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {deliveryFormats.map(format => (
                        <label key={format.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.deliveryFormat.includes(format.value)}
                            onChange={() => handleFormatChange(format.value)}
                            className="h-4 w-4 text-creax-orange focus:ring-creax-orange border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {format.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.deliveryFormat && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryFormat}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      修正回数
                    </label>
                    <select
                      name="revisions"
                      value={formData.revisions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-creax-orange focus:border-creax-orange"
                    >
                      <option value="0">修正なし</option>
                      <option value="1">1回まで</option>
                      <option value="2">2回まで</option>
                      <option value="3">3回まで</option>
                      <option value="unlimited">無制限</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: 確認 */}
            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-semibold mb-6">Step 3: 確認</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex">
                        <dt className="text-gray-600 w-32">タイトル:</dt>
                        <dd className="text-gray-900">{formData.title}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 w-32">カテゴリー:</dt>
                        <dd className="text-gray-900">
                          {categories.find(c => c.value === formData.category)?.label}
                        </dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 w-32">説明:</dt>
                        <dd className="text-gray-900">{formData.description}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">詳細設定</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex">
                        <dt className="text-gray-600 w-32">予算:</dt>
                        <dd className="text-gray-900">
                          ¥{Number(formData.budgetMin).toLocaleString()} 〜 
                          ¥{Number(formData.budgetMax).toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 w-32">納期:</dt>
                        <dd className="text-gray-900">{formData.deadline}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 w-32">納品形式:</dt>
                        <dd className="text-gray-900">
                          {formData.deliveryFormat.map(f => 
                            deliveryFormats.find(df => df.value === f)?.label
                          ).join(', ')}
                        </dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-600 w-32">修正回数:</dt>
                        <dd className="text-gray-900">
                          {formData.revisions === 'unlimited' ? '無制限' : `${formData.revisions}回まで`}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-orange-600 mr-2">ℹ️</span>
                      <div className="text-sm">
                        <p className="font-semibold text-orange-800 mb-1">案件公開について</p>
                        <p className="text-orange-700">
                          案件を作成すると、クリエーターから提案を受け取ることができます。
                          優秀なクリエーターから多くの提案を受けるために、詳細な説明を心がけてください。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-creax-orange focus:ring-creax-orange border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      非公開案件として作成（特定のクリエーターのみ閲覧可能）
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ボタン */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                前へ
              </button>
            )}
            {currentStep === 1 && <div />}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-creax-orange text-white rounded-lg hover:bg-creax-orange-dark transition"
              >
                次へ
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg transition ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-creax-orange text-white hover:bg-creax-orange-dark'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    作成中...
                  </span>
                ) : (
                  '案件を作成'
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}