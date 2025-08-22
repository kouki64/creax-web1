import Link from 'next/link';  // 最初に追加
import Image from 'next/image';  // 追加

export default function Header() {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* ロゴ - 画像に変更 */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Creax" 
                width={120}  // 幅を調整
                height={40}  // 高さを調整
                className="h-10 w-auto"  // 高さ固定で幅は自動調整
                priority  // 優先的に読み込み
              />
            </Link>
            
            {/* ナビゲーション */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-creax-orange transition">
                案件を探す
              </a>
              <a href="#" className="text-gray-700 hover:text-creax-orange transition">
                クリエーターを探す
              </a>
              <a href="#" className="text-gray-700 hover:text-creax-orange transition">
                料金
              </a>
            </nav>
            
            {/* ボタン */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-creax-orange transition">
                ログイン
              </Link>
              <Link href="/register" className="bg-creax-orange text-white px-4 py-2 rounded-lg hover:bg-creax-orange-dark transition">
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }