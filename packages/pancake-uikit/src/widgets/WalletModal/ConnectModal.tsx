import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import getExternalLinkProps from "../../util/getExternalLinkProps";
import Grid from "../../components/Box/Grid";
import Box from "../../components/Box/Box";
import getThemeValue from "../../util/getThemeValue";
import Text from "../../components/Text/Text";
import Heading from "../../components/Heading/Heading";
import { Button } from "../../components/Button";
import { ModalBody, ModalCloseButton, ModalContainer, ModalHeader, ModalTitle } from "../Modal";
import WalletCard, { MoreWalletCard, WalletButton } from "./WalletCard";
import config, { walletLocalStorageKey } from "./config";
import { Config, ConnectorNames, Login } from "./types";
import BinanceChain from "../../components/Svg/Icons/BinanceChain";
import Cro from '../../components/Svg/Icons/Cro'

interface Props {
  login: Login;
  onDismiss?: () => void;
  displayCount?: number;
  t: (key: string) => string;
}

const WalletWrapper = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

/**
 * Checks local storage if we have saved the last wallet the user connected with
 * If we find something we put it at the top of the list
 *
 * @returns sorted config
 */
const getPreferredConfig = (walletConfig: Config[]) => {
  const preferredWalletName = localStorage.getItem(walletLocalStorageKey);
  const sortedConfig = walletConfig.sort((a: Config, b: Config) => a.priority - b.priority);

  if (!preferredWalletName) {
    return sortedConfig;
  }

  const preferredWallet = sortedConfig.find((sortedWalletConfig) => sortedWalletConfig.title === preferredWalletName);

  if (!preferredWallet) {
    return sortedConfig;
  }

  return [
    preferredWallet,
    ...sortedConfig.filter((sortedWalletConfig) => sortedWalletConfig.title !== preferredWalletName),
  ];
};

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null, displayCount = 3, t }) => {
  const [showMore, setShowMore] = useState(false);
  const [networkClicked, setNetworkClicked] = useState(false);
  const theme = useTheme();
  const sortedConfig = getPreferredConfig(config);
  const displayListConfig = showMore ? sortedConfig : sortedConfig.slice(0, displayCount);
  const networks = [{
    title: 'BinanceSmartChain',
    icon: BinanceChain,
  }, {
    title: 'Chronos',
    icon: Cro,
  }];

  const clickHandler = (network: String) => {
    if(network === "BinanceSmartChain"){
      setNetworkClicked(true)
    }
  }

  return (
    <ModalContainer minWidth="320px">
      <ModalHeader background={getThemeValue("colors.gradients.bubblegum")(theme)}>
        <ModalTitle>
          <Heading>{t("Switch Network")}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody width={["320px", null, "340px"]}>
        <WalletWrapper py="24px" maxHeight="453px" overflowY="auto">
          <Grid gridTemplateColumns="1fr 1fr">
            {networkClicked ?
            <>
              {displayListConfig.map((wallet) => (
                <Box key={wallet.title}>
                  <WalletCard walletConfig={wallet} login={login} onDismiss={onDismiss} />
                </Box>
              ))}
              {!showMore && <MoreWalletCard t={t} onClick={() => setShowMore(true)} />}
            </>
            :
            networks.map((network) => {
              const { title, icon: Icon } = network;
              return <Box key={title} onClick={() => clickHandler(title)}>
                  <WalletButton variant="tertiary">
                    <Icon width="40px" mb="8px" />
                    <Text fontSize="14px">{title}</Text>
                  </WalletButton>
              </Box>
            })
          }
          </Grid>
        </WalletWrapper>
        <Box p="24px">
          <Text textAlign="center" color="textSubtle" as="p" mb="16px">
            {t("Haven’t got a crypto wallet yet?")}
          </Text>
          <Button
            as="a"
            href="https://docs.pancakeswap.finance/get-started/connection-guide"
            variant="subtle"
            width="100%"
            {...getExternalLinkProps()}
          >
            {t("Learn How to Connect")}
          </Button>
        </Box>
      </ModalBody>
    </ModalContainer>
  );
};

export default ConnectModal;
