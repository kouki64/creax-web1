'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { validateEmail, validatePassword, getPasswordStrength } from '@/lib/validation';
import Alert from '@/components/ui/Alert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'client',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{ level: 'weak' | 'medium' | 'strong'; percentage: number } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // パスワード強度をリアルタイム更新
    if (name === 'password' && value) {
      setPasswordStrength(getPasswordStrength(value));
    } else if (name === 'password' && !value) {
      setPasswordStrength(null);
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // 名前チェック
    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
    
    // メールチェック
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    // パスワードチェック
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    // パスワード確認チェック
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードを再入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    
    // 利用規約チェック
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '利用規約に同意してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setAlertMessage(null);
    
    // TODO: 実際の登録処理
    setTimeout(() => {
      setIsLoading(false);
      setAlertMessage({ 
        type: 'success', 
        message: 'アカウントを作成しました！確認メールをご確認ください。' 
      });
    }, 1500);
  };

  const getStrengthColor = (level: 'weak' | 'medium' | 'strong') => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getStrengthText = (level: 'weak' | 'medium' | 'strong') => {
    switch (level) {
      case 'weak': return '弱い';
      case 'medium': return '普通';
      case 'strong': return '強い';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image 
            src="/logo.png" 
            alt="Creax" 
            width={150}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          アカウントを作成
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          既にアカウントをお持ちの方は{' '}
          <Link href="/login" className="font-medium text-creax-orange hover:text-creax-orange-dark">
            ログイン
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {alertMessage && (
            <div className="mb-4">
              <Alert 
                type={alertMessage.type} 
                message={alertMessage.message}
                onClose={() => setAlertMessage(null)}
              />
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* アカウント種別選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                アカウント種別
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition ${
                    formData.role === 'client' 
                      ? 'border-creax-orange bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-2xl mb-1">🎬</div>
                    <div className="font-medium">クライアント</div>
                    <div className="text-xs text-gray-500 mt-1">案件を依頼する</div>
                  </div>
                </label>
                
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="creator"
                    checked={formData.role === 'creator'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition ${
                    formData.role === 'creator' 
                      ? 'border-creax-orange bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-2xl mb-1">🎵</div>
                    <div className="font-medium">クリエーター</div>
                    <div className="text-xs text-gray-500 mt-1">音楽を制作する</div>
                  </div>
                </label>
              </div>
            </div>

            {/* 名前 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                お名前（表示名）
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                  placeholder="山田 太郎"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                  placeholder="8文字以上"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                
                {/* パスワード強度インジケーター */}
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">パスワード強度</span>
                      <span className="text-xs font-medium">
                        {getStrengthText(passwordStrength.level)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength.level)}`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <p className="mt-1 text-xs text-gray-500">
                  8文字以上、大文字・小文字・数字を含む
                </p>
              </div>
            </div>

            {/* パスワード確認 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                パスワード（確認）
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-creax-orange focus:border-creax-orange`}
                  placeholder="パスワードを再入力"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* 利用規約 */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-creax-orange focus:ring-creax-orange border-gray-300 rounded mt-0.5"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  <Link href="#" className="text-creax-orange hover:text-creax-orange-dark">
                    利用規約
                  </Link>
                  {' '}と{' '}
                  <Link href="#" className="text-creax-orange hover:text-creax-orange-dark">
                    プライバシーポリシー
                  </Link>
                  {' '}に同意します
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-creax-orange hover:bg-creax-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-creax-orange'
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
                  'アカウントを作成'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Google
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                LINE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}