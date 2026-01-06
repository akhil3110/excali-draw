import { Sparkles, Pencil, Share2, Zap } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-900 text-blue-300 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Free & Open Source</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Sketch, Draw, and
            <span className="text-blue-400"> Collaborate</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A powerful whiteboard tool that lets you create beautiful diagrams, wireframes,
            and illustrations with an intuitive interface. Start drawing in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition-all hover:shadow-xl hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Drawing</span>
              <Zap className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-gray-800 text-gray-200 rounded-xl hover:bg-gray-700 font-semibold text-lg transition-all border-2 border-gray-700 hover:border-gray-600">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-700">
              <div className="bg-blue-900 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Pencil className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Intuitive Drawing</h3>
              <p className="text-gray-400">
                Create shapes, lines, and freehand drawings with powerful yet simple tools
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-700">
              <div className="bg-cyan-900 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Share2 className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Collaboration</h3>
              <p className="text-gray-400">
                Work together with your team in real-time on the same canvas
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-700">
              <div className="bg-green-900 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Export Anywhere</h3>
              <p className="text-gray-400">
                Export your work as PNG, SVG, or share with a simple link
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gray-800 rounded-3xl shadow-xl border border-gray-700 p-8 max-w-5xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Pencil className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-400 font-medium">Your canvas awaits...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
