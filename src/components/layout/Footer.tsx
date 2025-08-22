import Image from 'next/image';  // 最初に追加

export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
                <Image 
                    src="/logo.png" 
                    alt="Creax" 
                    width={120}
                    height={40}
                    className="h-10 w-auto mb-4"
                />
              <p className="text-gray-400">
                音楽制作の新しいカタチ
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">案件を探す</a></li>
                <li><a href="#" className="hover:text-white transition">クリエーターを探す</a></li>
                <li><a href="#" className="hover:text-white transition">料金プラン</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-white transition">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">利用規約</a></li>
                <li><a href="#" className="hover:text-white transition">プライバシーポリシー</a></li>
                <li><a href="#" className="hover:text-white transition">特定商取引法</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Creax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }