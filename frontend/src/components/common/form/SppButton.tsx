import './SppButton.scss';

import React, { useState, useRef } from 'react';
import { ReactComponent as SppIcon } from 'assets/images/SPP.svg';
import { Col, Overlay, Tooltip, Button, Row, Image } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';

interface ISppButtonProps {
  handleErpClick: () => void;
  handleSppClick: () => void;
}

const SppButton: React.FC<ISppButtonProps> = ({ handleErpClick, handleSppClick }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const target = useRef(null);

  const applyFilter = (callback: () => void) => {
    setVisible(false);
    callback();
  };

  return (
    <ClickAwayListener onClickAway={() => setVisible(false)}>
      <div className="sppButton">
        <Button ref={target} className="close" onClick={() => setVisible(true)}>
          <SppIcon title="spp" />
        </Button>
        <Overlay target={target.current!} show={visible} placement="bottom">
          {(props: any) => {
            return (
              <Tooltip id="overlay-spp" {...props} show={`${visible}`} className="sppTooltip">
                <h6>Properties On Surplus Properties Program</h6>
                <Row onClick={() => applyFilter(handleErpClick)}>
                  <Col xs={2} className="marker">
                    <Image src={require('assets/images/marker-icon-2x-red.png')} />
                  </Col>
                  <Col className="label">Enhanced Referral Process</Col>
                </Row>
                <Row onClick={() => applyFilter(handleSppClick)}>
                  <Col xs={2} className="marker">
                    <Image src={require('assets/images/marker-icon-2x-violet.png')} />
                  </Col>
                  <Col className="label">Surplus Properties List</Col>
                </Row>
              </Tooltip>
            );
          }}
        </Overlay>
      </div>
    </ClickAwayListener>
  );
};

export default SppButton;
