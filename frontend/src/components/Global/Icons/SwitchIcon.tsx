import { cn } from '@/lib/utils';
import React, { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
    fill?: string;
}

const SwitchIcon: React.FC<Props> = ({ fill = 'currentColor', className='', ...props }) => {
    return (
        <svg
            width={20}
            height={11}
            viewBox="0 0 20 11"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className)}
            {...props}
        >
            <path d="M19.2979 8.05052C18.7717 5.254 17.0151 3.43181 14.0237 3.43181H6.91974V0.287356C6.91974 0.0511055 6.64927 -0.0838554 6.4606 0.0577461L0.1147 4.81716C-0.0358081 4.93005 -0.038816 5.15564 0.109348 5.27224C6.88525 10.6076 6.43486 10.2868 6.57732 10.2868C6.7345 10.2868 6.86427 10.1594 6.86427 9.99978V6.70614H14.0237C15.7543 6.70614 17.5236 7.18728 18.8277 8.32025C19.033 8.49841 19.3483 8.31657 19.2979 8.05052Z" />
        </svg>
    );
};

export default SwitchIcon;
