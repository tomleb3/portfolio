import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { render } from 'react-dom';

import './index.scss';
import Typewriter from 'typewriter-effect';
import emailjs from 'emailjs-com';
import { icons } from './icons';
import { useClickCounter } from './hooks';
import { assertUnreachable, sleep } from './utils';

function Header() {
    const [state, setState] = useState<'initial' | 'annoyed'>('initial');

    const click = useClickCounter(7, () => setState('annoyed'));

    let headerMarkup: React.JSX.Element;
    switch (state) {
        case 'initial':
            headerMarkup = (
                <Typewriter
                    onInit={typewriter => {
                        typewriter.typeString('Tom Lebeodkin').start();
                    }}
                />
            );
            break;

        case 'annoyed':
            headerMarkup = <>Please stop that...</>;
            break;

        default:
            assertUnreachable(state);
    }

    return (
        <header className='main-header t-center'>
            <h1 className='name fs-xlarge'>
                <a href='#'>
                    <span onClick={click}>{headerMarkup}</span>
                </a>
            </h1>
        </header>
    );
}

function Nav() {
    return (
        <nav className='main-nav'>
            <div className='grow'>
                <a href='#about' className='reactive-link'>
                    About
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a href='#contact' className='reactive-link'>
                    Contact
                </a>
            </div>
            <div>
                <a href='https://www.github.com/tomleb3' aria-label='Github' target='_blank' rel='noopener noreferrer'>
                    {icons.github}
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a
                    href='https://www.linkedin.com/in/tomleb/'
                    aria-label='Linkedin'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {icons.linkedin}
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a
                    href='https://stackoverflow.com/users/15169145/tomleb'
                    aria-label='Stack Overflow'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {icons.stackOverflow}
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a href='https://www.npmjs.com/~tomleb' aria-label='NPM' target='_blank' rel='noopener noreferrer'>
                    {icons.npm}
                </a>
            </div>
        </nav>
    );
}

function Contact() {
    type FieldValidityStatus = 'no_input' | 'pattern_mismatch' | 'valid';
    interface ContactField {
        readonly text: string | null;
        readonly validityStatus: FieldValidityStatus;
    }
    interface ContactFields {
        readonly senderName: ContactField;
        readonly senderEmail: ContactField;
        readonly message: ContactField;
    }
    type State = ContactFields & {
        readonly sendState:
            | { readonly status: 'initial' | 'sending' | 'sending_succeeded' }
            | { readonly status: 'sending_failed'; readonly error: any };
    };

    const blankMessageField: ContactField = useMemo(
        () => ({
            text: null,
            validityStatus: 'valid',
        }),
        [],
    );
    const blankMessageFields: ContactFields = useMemo(
        () => ({
            senderName: blankMessageField,
            senderEmail: blankMessageField,
            message: blankMessageField,
        }),
        [blankMessageField],
    );
    const blankState: State = useMemo(
        () => ({ ...blankMessageFields, sendState: { status: 'initial' } }),
        [blankMessageFields],
    );

    const emailPattern = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    const [state, setState] = useState<State>(blankState);

    const handleChange = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldName = ev.currentTarget.name;
        const updatedMessageField: ContactField = {
            text: ev.currentTarget.value,
            // Only validate on form submit to avoid prematurely displaying negative feedback.
            validityStatus: 'valid',
        };
        setState(prev => {
            const updatedState: State = {
                ...prev,
                [fieldName]: updatedMessageField,
            };
            return updatedState;
        });
    };

    const validateInputs = (): boolean => {
        const { senderName, senderEmail, message } = state;
        let senderNameValidityStatus: FieldValidityStatus;
        if (senderName.text === null || senderName.text === '') {
            senderNameValidityStatus = 'no_input';
        } else {
            senderNameValidityStatus = 'valid';
        }
        let senderEmailValidityStatus: FieldValidityStatus;
        if (senderEmail.text === null || senderEmail.text === '') {
            senderEmailValidityStatus = 'no_input';
        } else if (!emailPattern.test(senderEmail.text)) {
            senderEmailValidityStatus = 'pattern_mismatch';
        } else {
            senderEmailValidityStatus = 'valid';
        }
        let messageValidityStatus: FieldValidityStatus;
        if (message.text === null || message.text === '') {
            messageValidityStatus = 'no_input';
        } else {
            messageValidityStatus = 'valid';
        }
        setState(prev => {
            const newState: State = {
                ...prev,
                senderName: {
                    ...prev.senderName,
                    validityStatus: senderNameValidityStatus,
                },
                senderEmail: {
                    ...prev.senderEmail,
                    validityStatus: senderEmailValidityStatus,
                },
                message: {
                    ...prev.message,
                    validityStatus: messageValidityStatus,
                },
            };
            return newState;
        });

        return (
            senderNameValidityStatus === 'valid' &&
            senderEmailValidityStatus === 'valid' &&
            messageValidityStatus === 'valid'
        );
    };

    const onSubmitForm = async (ev: ChangeEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!validateInputs()) {
            // Provide UI feedback.
            return;
        }
        setState(prev => {
            const newState: State = {
                ...prev,
                sendState: { status: 'sending' },
            };
            return newState;
        });
        try {
            await emailjs.sendForm(
                process.env.EMAILJS_SERVICEID ?? '',
                process.env.EMAILJS_TEMPLATEID ?? '',
                ev.currentTarget,
                process.env.EMAILJS_USERID ?? '',
            );
            setState(prev => {
                const newState: State = {
                    ...prev,
                    sendState: { status: 'sending_succeeded' },
                };
                return newState;
            });
        } catch (err: any) {
            console.error(err.text);
            setState(prev => {
                const newState: State = {
                    ...prev,
                    sendState: { status: 'sending_failed', error: err },
                };
                return newState;
            });
        }
    };

    useEffect(() => {
        switch (state.sendState.status) {
            case 'initial':
            case 'sending':
                break;

            case 'sending_succeeded':
            case 'sending_failed':
                // Reset state after given time.
                sleep(5_000).then(() => setState(blankState));
                break;

            default:
                assertUnreachable(state.sendState);
        }
    }, [state.sendState, blankState]);

    const ValidityStatusUserMessage = ({ field }: { readonly field: ContactField }) => {
        let message: string | null;

        switch (field.validityStatus) {
            case 'valid':
                message = null;
                break;
            case 'no_input':
                message = 'This field is required';
                break;
            case 'pattern_mismatch':
                // TODO: come up with better text
                message = 'Must match the pattern of the field';
                break;
            default:
                assertUnreachable(field.validityStatus);
        }

        return <p className={['t-danger', message === null ? 'v-hidden' : ''].join(' ')}>{message}</p>;
    };

    let sendButtonContent: React.JSX.Element | string;
    switch (state.sendState.status) {
        case 'initial':
            sendButtonContent = 'Send';
            break;

        case 'sending':
            sendButtonContent = <>{icons.spinner}&nbsp;Send</>;
            break;

        case 'sending_succeeded':
            sendButtonContent = 'Sent!';
            break;

        case 'sending_failed':
            sendButtonContent = (
                <>
                    No bueno 😔
                    <p>{state.sendState.error}</p>
                </>
            );
            break;

        default:
            assertUnreachable(state.sendState);
    }

    return (
        <section className='contact-section'>
            <form
                method='POST'
                onSubmit={onSubmitForm}
                // Validate manually.
                noValidate
            >
                <p className='t-center m-medium fs-xlarge fw-100'>Drop me a line</p>
                <label htmlFor='senderName'>Name</label>
                <input
                    type='text'
                    name='senderName'
                    className={state.senderName.validityStatus !== 'valid' ? 'invalid-input' : ''}
                    value={state.senderName.text ?? ''}
                    onChange={handleChange}
                />
                <ValidityStatusUserMessage field={state.senderName} />
                <label htmlFor='senderEmail'>Email</label>
                <input
                    type='email'
                    name='senderEmail'
                    className={state.senderEmail.validityStatus !== 'valid' ? 'invalid-input' : ''}
                    value={state.senderEmail.text ?? ''}
                    onChange={handleChange}
                />
                <ValidityStatusUserMessage field={state.senderEmail} />
                <label htmlFor='message'>Message</label>
                <textarea
                    name='message'
                    className={state.message.validityStatus !== 'valid' ? 'invalid-input' : ''}
                    value={state.message.text ?? ''}
                    onChange={handleChange}
                />
                <ValidityStatusUserMessage field={state.message} />
                <button className='btn-send' type='submit'>
                    {sendButtonContent}
                </button>
            </form>
        </section>
    );
}

function Footer() {
    const click = useClickCounter(5, () => alert('HA!'));

    return (
        <footer className='main-footer'>
            <div className='flex align-center' onClick={click}>
                {icons.nameTag}&nbsp;&nbsp;&nbsp;&nbsp;Tom Lebeodkin
            </div>
            <br />
            <a href='tel:+972545323660' className='flex align-center reactive-link'>
                {icons.phone}&nbsp;&nbsp;&nbsp;&nbsp;+972 54 5323660
            </a>
            <br />
            <a href='mailto:tomleb3@gmail.com' className='flex align-center reactive-link'>
                {icons.email}&nbsp;&nbsp;&nbsp;&nbsp;tomleb3@gmail.com
            </a>
            <br />
            <div className='flex align-center'>{icons.location}&nbsp;&nbsp;&nbsp;&nbsp;Israel / remote</div>
        </footer>
    );
}

function Main() {
    console.log(`
    ░░░░░░░░░░░░░░░░░░░░░▄▀░░▌
    ░░░░░░░░░░░░░░░░░░░▄▀▐░░░▌
    ░░░░░░░░░░░░░░░░▄▀▀▒▐▒░░░▌
    ░░░░░▄▀▀▄░░░▄▄▀▀▒▒▒▒▌▒▒░░▌
    ░░░░▐▒░░░▀▄▀▒▒▒▒▒▒▒▒▒▒▒▒▒█
    ░░░░▌▒░░░░▒▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄
    ░░░░▐▒░░░░░▒▒▒▒▒▒▒▒▒▌▒▐▒▒▒▒▒▀▄
    ░░░░▌▀▄░░▒▒▒▒▒▒▒▒▐▒▒▒▌▒▌▒▄▄▒▒▐
    ░░░▌▌▒▒▀▒▒▒▒▒▒▒▒▒▒▐▒▒▒▒▒█▄█▌▒▒▌
    ░▄▀▒▐▒▒▒▒▒▒▒▒▒▒▒▄▀█▌▒▒▒▒▒▀▀▒▒▐░░░▄
    ▀▒▒▒▒▌▒▒▒▒▒▒▒▄▒▐███▌▄▒▒▒▒▒▒▒▄▀▀▀▀
    ▒▒▒▒▒▐▒▒▒▒▒▄▀▒▒▒▀▀▀▒▒▒▒▄█▀░░▒▌▀▀▄▄
    ▒▒▒▒▒▒█▒▄▄▀▒▒▒▒▒▒▒▒▒▒▒░░▐▒▀▄▀▄░░░░▀
    ▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▄▒▒▒▒▄▀▒▒▒▌░░▀▄
    ▒▒▒▒▒▒▒▒▀▄▒▒▒▒▒▒▒▒▀▀▀▀▒▒▒▄▀
    `);

    return (
        <main className='main main-layout'>
            <Header />
            <Nav />
            <Contact />
            <Footer />
        </main>
    );
}

const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);
render(<Main />, container);