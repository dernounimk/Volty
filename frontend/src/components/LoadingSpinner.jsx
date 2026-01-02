import { useTranslation } from 'react-i18next';

const LoadingSpinner = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-transparent to-transparent'>
      <div className='relative flex flex-col items-center justify-center'>
        {/* Spinner Container */}
        <div className='relative mb-8'>
          {/* Outer Ring */}
          <div className='w-24 h-24 border-4 border-[var(--color-bg-gray)]/30 rounded-full' />
          
          {/* Animated Ring */}
          <div className='absolute inset-0 w-24 h-24 border-4 border-transparent border-t-[var(--color-electric)] border-r-[var(--color-electric)] animate-spin rounded-full' />
          
          {/* Inner Dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-4 h-4 bg-[var(--color-electric)] rounded-full animate-pulse' />
          </div>
          
          {/* Electric Dots */}
          <div className='absolute inset-0'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='absolute w-2 h-2 bg-[var(--color-electric)] rounded-full animate-ping'
                style={{
                  top: '10%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(40px)`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className='text-center space-y-3'>
          <div className='flex items-center justify-center space-x-2'>
            <div className='text-2xl font-semibold text-[var(--color-electric)] tracking-wider'>
              {t('loading')}
            </div>
            <div className='flex space-x-1'>
              <div className='w-2 h-2 bg-[var(--color-electric)] rounded-full animate-bounce' 
                   style={{ animationDelay: '0s' }} />
              <div className='w-2 h-2 bg-[var(--color-electric)] rounded-full animate-bounce' 
                   style={{ animationDelay: '0.2s' }} />
              <div className='w-2 h-2 bg-[var(--color-electric)] rounded-full animate-bounce' 
                   style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
          
          {/* Subtle Message */}
          <div className='text-sm text-[var(--color-text-secondary)] animate-pulse'>
            {t('loadingMessage') || 'جاري تحميل المحتوى...'}
          </div>
        </div>

        {/* Screen Reader Only */}
        <div className='sr-only'>{t('loading')}...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;