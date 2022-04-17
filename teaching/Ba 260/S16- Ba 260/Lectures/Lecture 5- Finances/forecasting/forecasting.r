######################
#  Ba 260 Example 1  #
######################

library('Sleuth3')
head(ex1111) # To see the data structure
data <- ex1111 
attach(data)

#Mushrooms (Y) vs Soil (X)
#plot(x,y)
par(mfrow=c(1,2))
plot(Soil, Mushroom,type="p", pch=20, col="blue", main="Cesium concentration", xlab="Soil cesium concentration",ylab="Mushrooms cesium concentration")
abline(lm(Mushroom~Soil))

plot(Soil, Mushroom,type="p", pch=20, col="white", main="Cesium concentration", xlab="Soil cesium concentration",ylab="Mushrooms cesium concentration")
abline(lm(Mushroom~Soil))
text(Soil, Mushroom)

#model construction 
mod.cesium <- lm(Mushroom ~ Soil)
summary(mod.cesium)

#residuals
residual <- resid(mod.cesium)
plot(Soil, residual,type="p", pch=20, col="blue", main="Residuals of Soil and Mushroom Cesium uptake", xlab="Soil",ylab="Residuals", )
abline(a=0,b=0)

#1 Studentized Residuals
rstud <- rstudent(mod.cesium)
plot(1:17, rstud, cex=0, main="Studentized residuals", xlab="Data point",ylab="Residual",  ylim=c(-4, 4));text(1:17,rstud);abline(0,0,lty=2);abline(2,0);abline(-2,0)

#2 Cook's Distances
cooks <- cooks.distance(mod.cesium)
plot(1:17, cooks,cex=0);text(1:17,cooks)

######################
#  Ba 260 Example 2  #
######################

data <- read.csv("Z:\\PhD Business\\Spring 15\\Stats 512\\HW\\HW 3\\density.csv",header=TRUE)
attach(data)

data$day_squared <- (day^2)
data$day_cubed <- (day^3)
data$day_quartic <- (day^4)

#Regression linear
mod.linear <- lm(log_density ~ day)
abline(mod.linear, col="firebrick")
summary(mod.linear)

#Regression quadratic
mod.quadratic <- lm(log_density ~ day + day_squared)
abline(mod.quadratic, col="firebrick")
summary(mod.quadratic)

#Regression cubic
mod.cubic <- lm(log_density ~ day + day_squared + day_cubed)
abline(mod.cubic, col="firebrick")
summary(mod.cubic)

#Regression quartic
mod.quartic <- lm(log_density ~ day + day_squared + day_cubed + day_quartic)
abline(mod.quartic, col="firebrick")
summary(mod.quartic)

#Regress all 4 at once
mod.linear <- lm(log_density ~ day)
mod.quadratic <- lm(log_density ~ day + day_squared)
mod.cubic <- lm(log_density ~ day + day_squared + day_cubed)
mod.quartic <- lm(log_density ~ day + day_squared + day_cubed + day_quartic)

#Get and store residuals
residual <- resid(mod.linear)
residual_squared <- resid(mod.quadratic)
residual_cubed <- resid(mod.cubic )
residual_quartic <- resid(mod.quartic)

# Extra sum of squares
ESS <- anova(fit.red)["Residuals","Sum Sq"] - anova(fit.par)["Residuals","Sum Sq"]
# Estimate of the variance from the full model
sigma2 <- anova(fit.par)["Residuals","Mean Sq"]

# F-statistic to compare full vs reduced model
F_stat <- (ESS/2)/sigma2

# p-value, DON'T MULTIPLY THIS BY 2!!
pf(F_stat,2,16,lower.tail=FALSE)

# Or obtain automatically:
anova(mod.quadratic, mod.linear)

######################
#  Ba 260 Example 3  #
######################

library('Sleuth3')
head(ex1320) # To see the data structure
data <- ex1320 


#create dummy variables
data$female  <- as.numeric(Sex=="female")
data$male  <- as.numeric(Sex=="male")

data$background_a  <- as.numeric(Background=="a")
data$background_b  <- as.numeric(Background=="b")
data$background_c  <- as.numeric(Background=="c")
attach(data)

#Non Additive Model
non_add <- lm(Score ~ as.factor(Background) + Sex + as.factor(Background):Sex) # Fit with interaction.
summary(non_add)
anova(non_add)

#Additive Model
#model c has the highest math background
mod.add <- lm(Score ~ female + background_a + background_b)
summary(mod.add)
anova(mod.add)

