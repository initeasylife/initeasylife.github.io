# CellPhoneDB
## Inputs
### counts data
gene*cell
### meta data
| cell | cell_type |
|  ----  | ----  |
| d-pos_AAACCTGAGCAGGTCA | NKcells_1|
| d-pos_AAACCTGGTACCGAGA | NKcells_0|
| d-pos_AAACCTGTCGCCATAA | NKcells_1|
| d-pos_AAACGGGTCAGTTGAC | Tcells|
| d-pos_AAAGATGCATTGAGCT | NKcells_0|
| d-pos_AAAGATGTCCAAAGTC | NKcells_0|
| d-pos_AAAGCAAAGAGGACGG | Myeloid|
| d-pos_AAAGCAACACATTCGA | NKcells_1|
| d-pos_AAAGTAGAGAGCCCAA | NKcells_0|
| d-pos_AAAGTAGCAAGCTGAG | NKcells_0|
### DEGs

The first column should be the cell type/cluster name (matching those in meta.txt) and the second column the associated gene id.

## data prepare
read mtx/barcode/features files
```R
#library
library(dplyr)
library(Seurat)
library(patchwork)
library(clustree)
library(harmony)
library(devtools)
library(DoubletFinder)
library(ROCR)
library(ggsci)
library(ggplot2)
#init
rm(list=ls())
options(stringsAsFactors = F)

#values


#args

wd.path = "/home/xxx/genedata/460"

setwd(wd.path)
paste("path : ",getwd())

# read from filtered_feature_bc_matrix
dataP460 <- Read10X(data.dir = "/home/xxx/genedata/data/P460/lhx/filtered_feature_bc_matrix")
# read from gz file
# read.table(gzfile("/home/xxx/genedata/cellphoneDB/GSE89567/GSE89567_IDH_A_processed_data.txt.gz"))
dim(dataP460)
loc<-which(rowSums(dataP460)==0)
dataP460<-dataP460[-loc,]
dim(dataP460)
pbmcP460 <- CreateSeuratObject(counts = dataP460, project = "P460", min.cells = 3, min.features = 200)
pbmcP460[["percent.mt"]] <- PercentageFeatureSet(pbmcP460, pattern = "^MT-")
```
质检

nFeature_RNA is the number of genes detected in each cell. 

nCount_RNA is the total number of molecules detected within a cell.

Low nFeature_RNA for a cell indicates that it may be dead/dying or an empty droplet.

High nCount_RNA and/or nFeature_RNA indicates that the "cell" may in fact be a doublet (or multiplet). 

In combination with %mitochondrial reads, removing outliers from these groups removes most doublets/dead cells/empty droplets,
hence why filtering is a common pre-processing step.

```R
VlnPlot(pbmcP460, features = c("nFeature_RNA", "nCount_RNA", "percent.mt"), ncol = 3)

pbmcP460 <- subset(pbmcP460, subset = nFeature_RNA < 2500 & nFeature_RNA > 300 & nCount_RNA< 5000)

pbmcP460 = NormalizeData(pbmcP460, normalization.method = "LogNormalize", scale.factor = 10000)
pbmc.combined <- pbmcP460
```
寻找高变基因
```R
pbmc.combined <- FindVariableFeatures(pbmc.combined, selection.method = "vst", nfeatures = 2000)
```
降维，为之后的聚类做准备
```R
#scale data
all.genes <- rownames(pbmc.combined)
pbmc.combined <- ScaleData(pbmc.combined, features = all.genes)

pbmc.combined <- RunPCA(pbmc.combined, features = VariableFeatures(object = pbmc.combined))

#find neighbors
pbmc.combined <- FindNeighbors(pbmc.combined, dims = 1:20,reduction = 'pca')
pbmc.combined <- FindClusters(pbmc.combined, resolution = 0.7,reduction = 'pca')

pbmc.combined <- RunUMAP(pbmc.combined, dims = 1:20,reduction='pca')
DimPlot(pbmc.combined, reduction = "umap",label=TRUE,pt.size=0.5)

pbmc.combined <- RunTSNE(pbmc.combined, dims = 1:20,reduction='pca')
DimPlot(pbmc.combined, reduction = "tsne",label=TRUE,pt.size=1.5)
```
double detect
```R
TODO
```
SingleR 标注
```R
library(ggplot2)
library(SingleR)
library(Seurat)
refdata <- HumanPrimaryCellAtlasData()

# cluster count table
cluster.count = data.frame(table(pbmc.combined@meta.data$seurat_clusters))

scRNA <- pbmc.combined
testdata <- GetAssayData(scRNA, slot="data")
clusters <- scRNA@meta.data$seurat_clusters
cellpred <- SingleR(test = testdata, ref = refdata, labels = refdata$label.fine, method = "cluster", clusters = clusters)

celltype = data.frame(ClusterID=rownames(cellpred), celltype=cellpred$labels, stringsAsFactors = F)

scRNA@meta.data$celltype = "NA"
for(i in 1:nrow(celltype)){
  scRNA@meta.data[which(scRNA@meta.data$seurat_clusters == celltype$ClusterID[i]),'celltype'] <- celltype$celltype[i]}
```


Finding differentially expressed features (cluster biomarkers)
```R
pbmc.markers <- FindAllMarkers(scRNA, only.pos = TRUE, min.pct = 0.25, logfc.threshold = 0.25)
pbmc.markers %>%
  group_by(cluster) %>%
  slice_max(n = 2, order_by = avg_log2FC)
```

转换成cellphonedb需要的文件

counts.txt    (Gene * Cell expression matrix)

meta.txt (Cell and Celltype)
```R

t1 = colnames(scRNA)
t1 = gsub("-",".",t1)
t2 = scRNA@meta.data[["celltype"]]
meta = data.frame(Cell=t1,cell_type=t2)
write.table(meta,file="/home/xxx/code/cellphonedb/meta_460.txt",sep="\t",row.names=FALSE,quote=FALSE)


library(dplyr)
library(stringr)
## convert gene_name to gene_id
counts=data.frame(scRNA@assays[["RNA"]]@data)
ref = read.table("/home/xxx/genedata/cellphoneDB/00be7d10-fd2d-4483-a712-72f24846610f.rna_seq.augmented_star_gene_counts.tsv",sep ="\t",header=TRUE)
gene_name = rownames(counts)
rownames(counts)=NULL
counts = cbind(gene_name,counts)
ref=ref[c('gene_id','gene_name')]
r = merge(ref,counts,by='gene_name',all.y=TRUE)
r=r[!is.na(r$gene_id),]
r=r[,-1]


gene_id = str_split(r$gene_id,"\\.",simplify = T)[,1]
r$gene_id=gene_id
write.table(r,file="/home/xxx/code/cellphonedb/counts_460.txt",quote=FALSE,sep="\t",row.names=FALSE)
```

CellPhoneDB
```
cellphonedb method analysis test_meta.txt test_counts.txt 
```
plot cpdb result
```R
library(ktplots)
library(Seurat)

library(SingleCellExperiment)

mean = read.table("/home/xxx/code/cellphonedb/out/means.txt",sep="\t",header=TRUE,check.names = FALSE)
pval = read.table("/home/xxx/code/cellphonedb/out/pvalues.txt",sep="\t",header=TRUE,check.names = FALSE)
decon = read.table("/home/xxx/code/cellphonedb/out/deconvoluted.txt",sep="\t",header=TRUE,check.names = FALSE)
scRNA = readRDS("/home/xxx/code/cellphonedb/scRNA.rds")
sce = as.SingleCellExperiment(scRNA)
celltype = scRNA@meta.data[["celltype"]]
p <- plot_cpdb3(cell_type1 = "B_cell", cell_type2 = "Endothelial_cells|NK_cell",
                scdata = sce,
                idents = "celltype",
                means = mean,
                pvals = pval,
                deconvoluted = decon, # new options from here on specific to plot_cpdb3
                keep_significant_only = TRUE,
                standard_scale = TRUE
)
p
```