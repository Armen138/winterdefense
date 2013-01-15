#!/bin/bash
montage *.png -background "rgba(0, 0, 0, 0)" -tile $(ls *png|wc -l)x1 -geometry 64x64+0+0 tower.png
