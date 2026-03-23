import { cn } from '@/lib/utils';


const TopGradient = ({
    className = '',
}) => {
    return (
        <div className={cn(className, '')}>
          <div className='w-70 h-70 blur-3xl bg-primary/30 shadow-[0_0_1000px_10px_rgba(5,150,102,0.4)] shadow-primary rounded-full -mt-50'>

          </div>
        </div>
    );
};

export default TopGradient;
