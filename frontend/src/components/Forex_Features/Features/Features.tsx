import Container from '@/components/Global/Container';
import RecentFeatures from './RecentFeatures';
import PopularFeatures from './PopularFeatures';



export default function Features() {




    return (
        <Container className='pb-10 md:pb-14'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 relative'>
                <div className='absolute w-full h-full bg-primary/40 blur-[80px]'>

                </div>
               <div className='lg:col-span-2 h-full relative'>
                 <RecentFeatures />
               </div>
                <PopularFeatures />
            </div>
        </Container>
    );
}

