import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (

    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url("https://t4.ftcdn.net/jpg/07/54/80/09/240_F_754800974_CXB9YRXM2ItqqUoEYouZnzctO9BTQhSv.jpg")' }}></div>
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg border border-white/30 p-8 text-white">      
          <SignIn className={'bg-transparent'} />
      </div>
    </div>
    
)
}