import * as React from 'react';

import Container from './widgets/Container';
import ExternalLink from './widgets/ExternalLink';
import SyncGate from './SyncGate';
import LoginForm from './components/LoginForm';
import EncryptionLoginForm from './components/EncryptionLoginForm';

import { store, CredentialsType } from './store';
import { login, deriveKey } from './store/actions';

import * as C from './constants';

import SignedPagesBadge from './images/signed-pages-badge.svg';

class LoginGate extends React.Component {
  public props: {
    credentials: CredentialsType;
  };

  constructor(props: any) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onEncryptionFormSubmit = this.onEncryptionFormSubmit.bind(this);
  }

  public onFormSubmit(username: string, password: string, encryptionPassword: string, serviceApiUrl?: string) {
    serviceApiUrl = serviceApiUrl ? serviceApiUrl : C.serviceApiBase;
    store.dispatch<any>(login(username, password, encryptionPassword, serviceApiUrl));
  }

  public onEncryptionFormSubmit(encryptionPassword: string) {
    store.dispatch(deriveKey(this.props.credentials.value!.credentials.email, encryptionPassword));
  }

  public render() {
    if (this.props.credentials.value === null) {
      const style = {
        isSafe: {
          textDecoration: 'none',
          display: 'block',
        },
        divider: {
          margin: '30px 0',
          color: '#00000025',
        },
      };

      return (
        <Container style={{maxWidth: '30rem'}}>
          <h2>Please Log In</h2>
          <LoginForm
            onSubmit={this.onFormSubmit}
            error={this.props.credentials.error}
            loading={this.props.credentials.fetching}
          />
          <hr style={style.divider} />
          <ExternalLink style={style.isSafe} href="https://www.etesync.com/faq/#signed-pages">
            <img alt="SignedPgaes badge" src={SignedPagesBadge} />
          </ExternalLink>
          <ul>
            <li><ExternalLink style={style.isSafe} href={C.homePage}>
                The EteSync Website
            </ExternalLink></li>
            <li><ExternalLink style={style.isSafe} href={C.faq + '#web-client'}>
                Is the web client safe to use?
            </ExternalLink></li>
            <li><ExternalLink style={style.isSafe} href={C.sourceCode}>Source code</ExternalLink></li>
          </ul>
        </Container>
      );
    } else if (this.props.credentials.value.encryptionKey === null) {
      return (
        <Container style={{maxWidth: '30rem'}}>
          <h2>Encryption Password</h2>
          <p>
            You are logged in as <strong>{this.props.credentials.value.credentials.email}</strong>.
            Please enter your encryption password to continue, or log out from the side menu.
          </p>
          <EncryptionLoginForm
            onSubmit={this.onEncryptionFormSubmit}
          />
        </Container>
      );
    }

    return (
      <SyncGate etesync={this.props.credentials.value} />
    );
  }
}

export default LoginGate;
