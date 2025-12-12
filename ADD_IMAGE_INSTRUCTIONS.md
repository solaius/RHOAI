# Add Pipeline Visualization Image

## Step 1: Add the PNG file
Save the pipeline visualization image to:
```
src/app/assets/autorag-pipeline-visualization.png
```

## Step 2: Update AutoRAG.tsx

At the top of the file (around line 79), add this import:
```typescript
import PipelineVisualization from '@app/assets/autorag-pipeline-visualization.png';
```

Then replace the placeholder div (around line 1018-1035) with:
```typescript
<div style={{ 
  padding: '2rem', 
  backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', 
  borderRadius: '4px',
  border: '1px solid var(--pf-v5-global--BorderColor--100)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}}>
  <img 
    src={PipelineVisualization} 
    alt="AutoRAG Pipeline Visualization showing the experiment flow from document collection through evaluation with multiple models" 
    style={{ 
      maxWidth: '100%', 
      height: 'auto',
      display: 'block'
    }}
    id="pipeline-visualization-image"
  />
</div>
```

## Step 3: Refresh
Clear webpack cache and restart the dev server:
```bash
rm -rf node_modules/.cache
npm run start:dev
```

