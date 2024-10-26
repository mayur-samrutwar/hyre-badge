import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-2 border-black mt-2 rounded-full flex justify-between items-center py-4 px-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src="/logo.jpeg" alt="Bio Link Logo" className="mr-4 w-12 h-12" />
          <nav className="flex space-x-6 font-semibold">
            <Link href="#" className="text-black hover:text-gray-600">Features</Link>
            <Link href="#" className="text-black hover:text-gray-600">FAQ</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4 font-semibold">
          <Link href="#" className="text-black hover:text-gray-600">Log in</Link>
          <Link href="#" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">Sign up</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative mt-20 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full ">
          {/* Mockups */}
          <div className="flex justify-between w-full">
            {/* Left mockup */}
            <div className="w-1/3">
              <div className="relative w-full pb-[100%]">
                <img
                  src="/a-3.png"
                  alt="Left Mockup"
                  className="absolute top-0 left-0 w-60 transform rotate-6 shadow-xl p-4 rounded-xl hover:shadow-lg bg-black -mt-16"
                />
              </div>
            </div>

            {/* Center content */}
            <div className="w-full max-w-2xl px-4 mb-12 flex flex-col items-center">
              <h2 className="text-center mb-2 bg-gray-100 rounded-lg py-2 px-4">Beta Version 1.0</h2>
              <h1 className="text-center text-7xl font-bold mb-8">
                Show your skills<br />in seconds
              </h1>
              <div className="flex justify-center mb-4 w-full max-w-md">
                <div className="flex w-full border-2 border-pink-400 rounded-lg overflow-hidden">
                  <div className="flex-grow px-4 py-3 bg-white">
                    <span className="font-semibold">hyreme.xyz/</span><input
                      type="text"
                      placeholder="yourname"
                      className="focus:outline-none"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 hover:from-pink-600 hover:to-purple-600 transition duration-200 whitespace-nowrap">
                    Create my link
                  </button>
                </div>
              </div>
              <p className="text-center text-gray-500">It's free, and takes less than a minute</p>
            </div>

            {/* Right mockup */}
            <div className="w-1/3">
              <div className="relative w-full pb-[100%]">
                <img
                  src="/a-2.png"
                  alt="Right Mockup"
                  className="absolute top-0 right-0 w-60 transform -rotate-6 shadow-xl p-4 rounded-xl hover:shadow-lg -mt-16"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <a href="/" className="flex justify-center">
              <img src="/logo.jpeg" alt="HyreMe Logo" className="w-24 h-auto" />
            </a>
            <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-8 transition-all duration-500 py-10 mb-10 border-b border-gray-200">
              <li>
                <Link href="/privacy" className="text-gray-800 hover:text-pink-500">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-pink-500">Features</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-800 hover:text-pink-500">Terms of Use</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-800 hover:text-pink-500">Privacy Policy</Link>
              </li>
            </ul>
            <div className="flex space-x-10 justify-center items-center mb-10">
              {/* Social media icons */}
              <a href="#" className="text-gray-900 hover:text-pink-500 transition-all duration-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-900 hover:text-pink-500 transition-all duration-500">
                <svg class="w-[1.688rem] h-[1.688rem] " viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.76556 14.8811C9.76556 12.3243 11.8389 10.2511 14.3972 10.2511C16.9555 10.2511 19.03 12.3243 19.03 14.8811C19.03 17.4379 16.9555 19.5111 14.3972 19.5111C11.8389 19.5111 9.76556 17.4379 9.76556 14.8811ZM7.26117 14.8811C7.26117 18.82 10.456 22.0129 14.3972 22.0129C18.3385 22.0129 21.5333 18.82 21.5333 14.8811C21.5333 10.9422 18.3385 7.7493 14.3972 7.7493C10.456 7.7493 7.26117 10.9422 7.26117 14.8811ZM20.1481 7.46652C20.148 7.79616 20.2457 8.11843 20.4288 8.39258C20.6119 8.66674 20.8723 8.88046 21.177 9.00673C21.4817 9.133 21.8169 9.16614 22.1405 9.10196C22.464 9.03778 22.7612 8.87916 22.9945 8.64617C23.2278 8.41318 23.3868 8.11627 23.4513 7.79299C23.5157 7.46972 23.4829 7.13459 23.3568 6.83C23.2307 6.5254 23.017 6.26502 22.7428 6.08178C22.4687 5.89853 22.1463 5.80065 21.8164 5.80052H21.8158C21.3737 5.80073 20.9497 5.9763 20.637 6.28867C20.3243 6.60104 20.1485 7.02467 20.1481 7.46652ZM8.78274 26.1863C7.42782 26.1246 6.69138 25.8991 6.20197 25.7085C5.55314 25.4561 5.0902 25.1554 4.60346 24.6696C4.11672 24.1839 3.81543 23.7216 3.56395 23.0732C3.37317 22.5843 3.14748 21.8481 3.08588 20.494C3.01851 19.03 3.00506 18.5902 3.00506 14.8812C3.00506 11.1722 3.01962 10.7336 3.08588 9.26841C3.14759 7.9143 3.37495 7.17952 3.56395 6.68919C3.81654 6.04074 4.11739 5.57808 4.60346 5.09163C5.08953 4.60519 5.55203 4.30408 6.20197 4.05274C6.69116 3.86208 7.42782 3.63652 8.78274 3.57497C10.2476 3.50763 10.6877 3.49419 14.3972 3.49419C18.1068 3.49419 18.5473 3.50874 20.0134 3.57497C21.3683 3.63663 22.1035 3.86385 22.5941 4.05274C23.243 4.30408 23.7059 4.60585 24.1926 5.09163C24.6794 5.57741 24.9796 6.04074 25.2322 6.68919C25.4229 7.17808 25.6486 7.9143 25.7102 9.26841C25.7776 10.7336 25.7911 11.1722 25.7911 14.8812C25.7911 18.5902 25.7776 19.0287 25.7102 20.494C25.6485 21.8481 25.4217 22.5841 25.2322 23.0732C24.9796 23.7216 24.6787 24.1843 24.1926 24.6696C23.7066 25.155 23.243 25.4561 22.5941 25.7085C22.105 25.8992 21.3683 26.1247 20.0134 26.1863C18.5485 26.2536 18.1084 26.2671 14.3972 26.2671C10.686 26.2671 10.2472 26.2536 8.78274 26.1863ZM8.66768 1.0763C7.18823 1.14363 6.17729 1.37808 5.29443 1.72141C4.3801 2.07597 3.60608 2.55163 2.83262 3.32341C2.05916 4.09519 1.58443 4.86997 1.22966 5.78374C0.88612 6.66663 0.651535 7.67641 0.584162 9.15497C0.515676 10.6359 0.5 11.1093 0.5 14.8811C0.5 18.6529 0.515676 19.1263 0.584162 20.6072C0.651535 22.0859 0.88612 23.0955 1.22966 23.9784C1.58443 24.8916 2.05927 25.6673 2.83262 26.4387C3.60597 27.2102 4.3801 27.6852 5.29443 28.0407C6.17896 28.3841 7.18823 28.6185 8.66768 28.6859C10.1502 28.7532 10.6232 28.77 14.3972 28.77C18.1713 28.77 18.645 28.7543 20.1268 28.6859C21.6063 28.6185 22.6166 28.3841 23.5 28.0407C24.4138 27.6852 25.1884 27.2105 25.9618 26.4387C26.7353 25.667 27.209 24.8916 27.5648 23.9784C27.9083 23.0955 28.144 22.0857 28.2103 20.6072C28.2777 19.1252 28.2933 18.6529 28.2933 14.8811C28.2933 11.1093 28.2777 10.6359 28.2103 9.15497C28.1429 7.6763 27.9083 6.66608 27.5648 5.78374C27.209 4.87052 26.7341 4.09641 25.9618 3.32341C25.1896 2.55041 24.4138 2.07597 23.5011 1.72141C22.6166 1.37808 21.6062 1.14252 20.1279 1.0763C18.6461 1.00897 18.1724 0.992188 14.3983 0.992188C10.6243 0.992188 10.1502 1.00785 8.66768 1.0763Z" fill="currentColor"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-900 hover:text-pink-500 transition-all duration-500">
                <svg class="w-[0.938rem] h-[1.625rem]" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.7926 14.4697L14.5174 9.86889H10.0528V6.87836C10.0528 5.62033 10.6761 4.39105 12.6692 4.39105H14.7275V0.473179C13.5289 0.282204 12.3177 0.178886 11.1037 0.164062C7.42917 0.164062 5.0302 2.37101 5.0302 6.36077V9.86889H0.957031V14.4697H5.0302V25.5979H10.0528V14.4697H13.7926Z" fill="currentColor"></path>
                </svg>
              </a>

              <a href="#" className="text-gray-900 hover:text-pink-500 transition-all duration-500">
                <svg class="w-[1.875rem] h-[1.375rem]" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M26.3106 1.27838C27.5782 1.62071 28.5745 2.61957 28.9113 3.88573C29.524 6.18356 29.524 10.9809 29.524 10.9809C29.524 10.9809 29.524 15.7782 28.9113 18.076C28.5698 19.3469 27.5735 20.3457 26.3106 20.6834C24.0186 21.2977 14.8226 21.2977 14.8226 21.2977C14.8226 21.2977 5.63122 21.2977 3.33456 20.6834C2.06695 20.3411 1.07063 19.3422 0.73385 18.076C0.121094 15.7782 0.121094 10.9809 0.121094 10.9809C0.121094 10.9809 0.121094 6.18356 0.73385 3.88573C1.07531 2.61488 2.07162 1.61602 3.33456 1.27838C5.63122 0.664062 14.8226 0.664062 14.8226 0.664062C14.8226 0.664062 24.0186 0.664062 26.3106 1.27838ZM19.5234 10.9809L11.885 15.403V6.55872L19.5234 10.9809Z" fill="currentColor"></path>
                </svg>
              </a>
            </div>
            <span className="text-lg text-gray-500 text-center block">
              © 2024 HyreMe, All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
