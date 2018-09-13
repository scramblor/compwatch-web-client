import React, { Component } from 'react';
import styled, {css} from 'styled-components';

class MatchEntryPresentation extends Component {
  render() {
    return (
      <div className="MatchEntry">
        {this.props.message ? <div> {this.props.message}</div> : null}
        <FlexContainer onSubmit={this.props.handleSubmit}>
          <div style={{width: '100%'}}>
            Current SR: <input type="text" name="currentSR" value={this.props.currentSR} onChange={this.props.currentSRChange}/>
            New SR: <input type="text" name="newSR" value={this.props.newSR} onChange={this.props.newSRChange}/>
            Result: {this.props.result} SR Change: {this.props.SRDiff}
          </div>

          <div style={{'maxWidth': '900px', margin: '10px'}}>
          {this.props.sortedHeroes ? 
            Object.keys(this.props.sortedHeroes).map((heroType, i) => {
              return (
                <div key={heroType}>
                  <div>{heroType}:</div>
                  
                  {this.props.sortedHeroes[heroType].map((item,i) => 
                    <PickerElement type='checkbox' key={item.name} imgUrl={getImageFromHero(item)} name={item.name} onChange={this.props.heroSelectChange} checked={this.props.selectedHeroes[item.name]  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>

          <div>
          {this.props.sortedMaps ? 
            Object.keys(this.props.sortedMaps).map((mapType, i) => {
              return (
                <div key={mapType}>
                  <div>{mapType}:</div>
                  
                  {this.props.sortedMaps[mapType].map((item,i) => 
                    <PickerElement type='radio' imgUrl={getImageFromMap(item)} key={item.name} name={item.name} onChange={this.props.mapSelectChange} checked={this.props.selectedMap === item.name  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>


           <div style={{width: '100%'}}><input type="submit" value="Submit" /></div> 
        </FlexContainer>
      </div>
    );

  }
}

function getImageFromHero(hero) {
  return process.env.PUBLIC_URL + "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

function getImageFromMap(map) {
  return process.env.PUBLIC_URL + "/images/maps/" + map.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + "_link.png";
}

const PickerElement = ({name, onChange, checked, imgUrl, type}) => {
  return (
      <span>
        <input type={type} name={name} id={name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <PickerItem htmlFor={name} checked={checked}>
          <PickerImage src={imgUrl} alt={name} title={name} />
          <PickerText> {name} </PickerText>
        </PickerItem>
      </span>
    );
};

const FlexContainer = styled.form `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const PickerItem = styled.label `
      height: 90px;
      width: 101px;
      display: inline-block;
      padding: 0 0 0 0px;
      border-style: solid;
      border-color: ${props => props.checked ? "red" : "white"};
      position: relative;
      filter: ${props => props.checked ? "grayscale(0%)" : "grayscale(70%)"};;
      ${css`
          &:hover {
            -webkit-filter: grayscale(0%); /* Safari 6.0 - 9.0 */
            filter: grayscale(0%);
          }
      `}
`;

const PickerImage = styled.img `
  width: 100%;
  height: 100%;
`;

const PickerText = styled.span `
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translate(-50%, 0);
  color: white;
  text-shadow: -1px -1px 1px rgba(0,0,0,0.667), 1px 1px 1px #000000;
`

export default MatchEntryPresentation