import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <HeroSection />
        
        {/* 特徴セクション */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Creaxの特徴
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-creax-orange mb-3">
                  安心決済
                </h3>
                <p className="text-gray-600">
                  エスクロー決済により、安全な取引を実現。納品確認後に支払いが完了します。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-creax-orange mb-3">
                  豊富な人材
                </h3>
                <p className="text-gray-600">
                  作曲家、アレンジャー、ミックスエンジニアなど、プロのクリエーターが多数在籍。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-creax-orange mb-3">
                  公平な収益分配
                </h3>
                <p className="text-gray-600">
                  業界最低水準の手数料。クリエーターの収益を最大化します。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}