"use client"
import React from 'react';
import { Typography, Box, Grid2 as Grid, ButtonGroup, Button, Popper, Grow, Paper, ClickAwayListener, MenuItem , MenuList, IconButton, Snackbar, Link } from "@mui/material";
import ModelRenderCard from "@/components/ModelRenderCard"
import ImageComparisonSlider from "@/components/ImageComparison/ImageComparisonSlider";
import SideBySideComparison from './ImageComparison/SideBySideComparison'
import ImageDifferenceView from './ImageComparison/ImageDifferenceView';
import Mesh3DComparisonSlider from './Mesh3DComparison/Mesh3DComparisonSlider';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from "./ComparePage.module.css";
import InfoIcon from '@mui/icons-material/Info';
import LaunchIcon from '@mui/icons-material/Launch';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import EngineSelection from './EngineSelection';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ComparisonButton from '@/components/ComparisonButton';
import { basePath } from '@/lib/paths';

type RenderView = {
  name: string,
  thumbnail: string,
  image: string
}

type ComparePageProps = {
  name: string,
  label: string,
  description: string,
  renderViews: Array<RenderView>,
  downloadUrl?: string
}

export default function ComparePage({name, label, renderViews, description, downloadUrl}: ComparePageProps) {  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const [sliderPosition, setSliderPosition] = React.useState(50); // Initial slider position (50%)
  const [isVisible, setIsVisible] = React.useState(!isXs); 
  const [isMagnified, setMagnified] = React.useState(false);
  const [engine1, setEngine1] = React.useState('three.js');
  const [engine2, setEngine2] = React.useState('filament.js');
  const [nextEngine, setNextEngine] = React.useState(0);
  const [comparisonMode, setComparisonMode] = React.useState(3);
  const [shareSnackbarOpen, setShareSnackbarOpen] = React.useState(false);
  const zoomOffsetRef = React.useRef<HTMLDivElement>(null);

  const toggleDiv = () => {
    setIsVisible(!isVisible);
  };

  const toggleMagnified = (open: boolean) => {
    
    const off = zoomOffsetRef && zoomOffsetRef.current;
    if(off && open)
      setTimeout(() => {window.scrollTo({top: off.offsetTop, behavior: 'smooth'});}, 20)
    setMagnified(open);
  }

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    // Access specific search parameters
    const param1 = searchParams.get("engine1");
    const param2 = searchParams.get("engine2");

    if(param1) { setEngine1(param1) }
    if(param2) { setEngine2(param2) }    

  }, []);

  const toggleSelection = (engine: string) => {
    if (engine1 === engine || engine2 === engine) {
      return;
    }
    
    if (nextEngine === 0 ) {
      setEngine1(engine);
      setNextEngine(1);
    } else  {
      setEngine2(engine);
      setNextEngine(0);
    }
  };

  const e1 = renderViews.find(e=> e.name === engine1);
  let image1 = (e1 && e1.image) || "";
  image1 = `${basePath}${image1}`;
  let image2 = renderViews.find(e=> e.name === engine2)?.image || "";
  image2 = `${basePath}${image2}`;

  const onShare = () => {
    const shareURL = `${basePath}/compare/${name}?engine1=${engine1}&engine2=${engine2}`;
    if (navigator.share) {
      navigator.share({
        title: `Khronos Render Fidelity`,
        url: shareURL
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else {
      // fallback
      navigator.clipboard.writeText(shareURL);
      setShareSnackbarOpen(true);
    }
  }

  const descriptionComponent = <Box>
    <Box display='flex' justifyContent='space-between'>
      <Typography variant='h6'>Description</Typography>
      <Box>
        {false && <IconButton onClick={onShare}><ShareIcon sx={{color: 'grey.100'}}/></IconButton>}
        <Snackbar
          open={shareSnackbarOpen}
          onClose={() => {setShareSnackbarOpen(false)}}
          message="Model Copied"
          key={"Share"}
          autoHideDuration={1200}
        />
        {downloadUrl && <IconButton component="a" href={downloadUrl} download><FileDownloadIcon sx={{color: 'grey.100'}}/></IconButton>}
      </Box>
    </Box>
    <Typography textAlign='left'>{description}</Typography>
    <Box mt={2}>
      <Link href={`https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/${name}/README.md`} color="inherit" underline='hover' target="_blank" rel="noopener" sx={{fontWeight:'bold', display:'flex', alignItems:'center'}}>More info <LaunchIcon fontSize='small' sx={{ml:0.5}}/></Link>
    </Box>
    <Box display='flex' alignItems='center' mt={1}>
      <Link onClick={onShare} href="#" color="inherit" underline='hover' target="_blank" rel="noopener" sx={{fontWeight:'bold', display:'flex', alignItems:'center'}}>Share <ShareIcon fontSize='small' sx={{color: 'grey.100', ml: 0.5}}/></Link>
    </Box>
  </Box>;

  const changePosition = (value: number) => {
    setSliderPosition(value);
  };

  console.log("RENDERVIEWS", renderViews);
  const viewers_3d = ['three-gpu-pathtracer', 'babylon.js', 'three.js', 'gltf-sample-viewer'];
  
  return (
    <>
      <Grid container direction={{xs:"column-reverse", sm:'row'}} className={styles.main} sx={{flexWrap: "nowrap"}} spacing={2}>
        {!isMagnified && <Grid className={styles.description} height={"70vh"} sx={{overflow: "auto"}}>
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center" }}> 
            <Typography variant='h6' component="h1">{label}</Typography>
            <Box onClick={toggleDiv} display={{ xs: 'inline-block', sm: 'none' }}>
              <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                {isXs && <InfoIcon />}
              </Box>
            </Box>
          </Box>
          {(!isXs) && descriptionComponent}
          {(isXs && isVisible) && descriptionComponent}
        </Grid>}
        {/* Main */}
        <Box ref={zoomOffsetRef} className={styles.tool} width={{xs:'100%', sm: isMagnified? '100%' : '60%'}}>
          <Box pb={1} sx={{display:'flex', width: "100%", justifyContent: {xs: 'space-between', sm:'space-between'}}}>
            {!isXs && isMagnified && <CloseFullscreenIcon onClick={() => toggleMagnified(false)} sx={{cursor: "pointer"}} /> }
            {!isXs && !isMagnified && <OpenInFullIcon onClick={() => toggleMagnified(true)} sx={{cursor: "pointer"}} /> }
            {isXs && <Box width={"24px"}/>}

            {comparisonMode===1 && sliderPosition <  50 && <SwitchLeftIcon onClick={() => setSliderPosition(100)} sx={{cursor: "pointer"}} />}
            {comparisonMode===1 && sliderPosition >= 50 && <SwitchRightIcon onClick={() => setSliderPosition(0)} sx={{cursor: "pointer"}} />}
                
            <ComparisonButton handleSelection={(index:number) => {setComparisonMode(index)}}/>
          </Box>
          {comparisonMode===0 && <SideBySideComparison imgSrc1={image1} imgSrc2={image2}/>}
          {comparisonMode===1 && <ImageComparisonSlider key={isMagnified.toString()} imgSrc1={image1} imgSrc2={image2} setSliderPosition={changePosition} sliderPosition={sliderPosition}/>}
          {comparisonMode===2 && <ImageDifferenceView key={isMagnified.toString()} imgSrc1={image1} imgSrc2={image2}/>}
          {comparisonMode===3 && <Mesh3DComparisonSlider key={isMagnified.toString()} imgSrc1={image1} imgSrc2={image2} src={downloadUrl} setSliderPosition={changePosition} sliderPosition={sliderPosition}/>}
          <Box display={{xs: 'flex', sm:'none'}} justifyContent='space-between' width='100%' pl={1} pr={1}>
            <Box flex={1}><EngineSelection engineName={engine1} engineList={renderViews.map(e=> e.name)} handleChange={(name) => { if(name!==engine1 && name!==engine2) {setEngine1(name)} }}/></Box>
            <Box flex={1} display='flex' justifyContent='flex-end'><EngineSelection engineName={engine2} engineList={renderViews.map(e=> e.name)} handleChange={(name) => { if(name!==engine1 && name!==engine2) {setEngine2(name)} }}/></Box>
          </Box>
          <Box display={{xs: 'none', sm:'flex'}} justifyContent='space-between' width='100%' pl={1} pr={1}>
            <Box flex={1}><Typography>{engine1}</Typography></Box>
            <Box flex={1} display='flex' justifyContent='flex-end'><Typography>{engine2}</Typography></Box>
          </Box>
        </Box>
        {!isMagnified && <Grid className={styles.side} display={{xs:'none', sm:'flex'}} sx={{overflow: "auto"}} height={"70vh"} container spacing={2}>
          {renderViews.map((e,i) => { return <ModelRenderCard key={e.name} name={e.name} thumbnail={e.thumbnail} marked={(engine1 === e.name || engine2 === e.name)} onSelection={toggleSelection}/>})}
        </Grid>}
      </Grid>
    </>
  )
}
