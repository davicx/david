import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import static java.lang.System.*;

public class OrganizeInts {
    public static void main(String[] args) {
        //arrayListOriginal
        //arrayListFinal

        //Step 1: Create the Array Lists
        ArrayList<Integer> arrayListOriginal = new ArrayList<Integer>();
        ArrayList<Integer> arrayListFinal = new ArrayList<Integer>();

        //Step 2: Add the Items (1,5,1,1,6,4)
        arrayListOriginal.add(1);
        arrayListOriginal.add(5);
        arrayListOriginal.add(1);
        arrayListOriginal.add(1);
        arrayListOriginal.add(6);
        arrayListOriginal.add(4);
        System.out.println(arrayListOriginal);

        //Step 3: Find Original Lowest Item and remove
        int minIndex = arrayListOriginal.indexOf(Collections.min(arrayListOriginal));
        int lowestValue =  arrayListOriginal.get(minIndex);
        //int lowestValue = arrayListOriginal[minIndex];
        arrayListOriginal.remove(minIndex);
        //System.out.println(arrayListOriginal);
        //System.out.println(lowestValue);

        //Step 4: Create New Array List (first item)
        arrayListFinal.add(lowestValue);
        //System.out.println(arrayListFinal);

        //Step 5: Call Function to get Next Value (Higher then the int passed in but lower then any other value in the array)
        int currentValue = lowestValue;

        for (int i = 0; i < arrayListOriginal.size(); i++) {
            int valueToTest = arrayListOriginal.get(i);

            System.out.println(currentValue + " " + valueToTest);

            //Step 6: We only care about greater values
            int valueToAddToArray = 100000;

            if(currentValue < valueToTest ) {
                //if value to add to array is less then current valueToAddToArray update
                //valueToAddToArray = valueToAddToArray;

                //Step 7: Search for Smallest Value that is larger then current value
                System.out.println("greater");
            }

            /*
            //Spit out all comparisons
            if(currentValue < valueToTest ) {
                System.out.println("greater");
            } else if (currentValue == valueToTest){
                System.out.println("equal");
            } else {
                System.out.println("less");
            }
            */

        }

        /*
        for (int i = 0; i < arrayListOriginal.size(); i++) {

            //System.out.print(arrayListOriginal.get(i) + " ");

        }
        */

        //System.out.println(minIndex);
        //out.println(Arrays.toString(arrayListOriginal));
        //alist.add(3, "Item at Position 3");
        //alist.remove(2);

    }

    //Function: Return the next highest value (Params: Array to Search and Value to Find Next Highest)
    public static int add(int a, int b){
        return a;
    }

}
