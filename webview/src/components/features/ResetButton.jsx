import Button from '../common/Button';
import Section from '../common/Section';
import { useMessage } from '../../hooks/useMessage';
import { initialContextState } from '../../contexts/MessageContext';

const ResetButton = () => {
  const { setState, state } = useMessage();
  const { app: { isAuthenticated, authData: { provider = null } = {} } = {} } = state;

  const handleOnClick = () => {
    initialContextState.app.authData.provider = provider;
    initialContextState.app.isAuthenticated = isAuthenticated;
    setState({ ...initialContextState });
  };

  if (!isAuthenticated) return;
  return (
    <Section>
      <Button label="Reset" handleOnClick={handleOnClick} />
    </Section>
  );
};
export default ResetButton;
