export default function HeroSection() {
    return (
      <section className="bg-gradient-to-br from-creax-orange to-creax-orange-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              クリエーターとクライアントを繋ぐ
              <br />
              音楽制作プラットフォーム
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              プロの音楽クリエーターと直接つながり、
              あなたの理想の音楽を制作しましょう
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-creax-orange px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg">
                クライアントとして始める
              </button>
              <button className="bg-creax-orange-dark text-white px-8 py-4 rounded-lg font-semibold hover:bg-creax-orange-dark/90 transition shadow-lg">
                クリエーターとして始める
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }