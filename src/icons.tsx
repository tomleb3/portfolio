import React, { useLayoutEffect, useRef } from 'react';

import nameTagIcon from './assets/svg/name-tag.svg';
import phoneIcon from './assets/svg/phone.svg';
import emailIcon from './assets/svg/email.svg';
import locationIcon from './assets/svg/location.svg';
import githubIcon from './assets/svg/github.svg';
import linkedinIcon from './assets/svg/linkedin.svg';
import stackOverflowIcon from './assets/svg/stack-overflow.svg';
import npmIcon from './assets/svg/npm.svg';
import spinnerIcon from './assets/svg/spinner.svg';

function createIcon(svgString: string) {
    return function Icon({ size = 1 }: { readonly size?: number }) {
        const ref = useRef<HTMLSpanElement>(null);
        useLayoutEffect(() => {
            ref.current!.style.fontSize = `${size}em`;
        }, [size]);

        return <span ref={ref} dangerouslySetInnerHTML={{ __html: svgString }} className='tl-icon' />;
    };
}

export const NameTagIcon = createIcon(nameTagIcon);
export const PhoneIcon = createIcon(phoneIcon);
export const EmailIcon = createIcon(emailIcon);
export const LocationIcon = createIcon(locationIcon);
export const GithubIcon = createIcon(githubIcon);
export const LinkedinIcon = createIcon(linkedinIcon);
export const StackOverflowIcon = createIcon(stackOverflowIcon);
export const NpmIcon = createIcon(npmIcon);
export const SpinnerIcon = createIcon(spinnerIcon);
