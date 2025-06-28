import Button from '../common/Button';
import Section from '../common/Section';
import { useMessage } from '../../hooks/useMessage';
import { initialContextState } from '../../contexts/MessageContext';

const ResetButton = () => {
  const { setState, state } = useMessage();
  const { isAuthenticated } = state;
  const handleOnClick = () => {
    setState(initialContextState);
  };

  if (!isAuthenticated) return;
  return (
    <Section>
      <Button label="Reset" handleOnClick={handleOnClick} />
    </Section>
  );
};
export default ResetButton;
