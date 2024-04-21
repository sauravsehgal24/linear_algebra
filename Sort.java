import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class Sort {

    private static List<NamesStruct> _listNames;
    static class NamesStruct {
        public String firstName;
        public String lastName;
        NamesStruct(){}
    }

    static class Task implements Runnable {
        public int start;
        public int end;
        Task(int start,int end){this.start = start; this.end = end;}
        //sort the list upto some index in a seperate hardware thread
        @Override
        public void run() {
            SortList(start,end);
        }
    }

    public static List<NamesStruct> MapFile(String filePath) throws IOException {
        ArrayList<NamesStruct> listNames = new ArrayList<NamesStruct>();
        // open then file and read the names into the struct
        FileReader fr = new FileReader(filePath);
        BufferedReader br = new BufferedReader(fr);
        String line;
        while ((line = br.readLine()) != null) {
            String[] names = line.split(" ");
            NamesStruct ns = new Sort.NamesStruct();
            // check if there is no last name
            if(names.length==1){
                ns.lastName = "";
            }else{
                ns.lastName = names[1];
            }
            ns.firstName = names[0] == null ? "" : names[0];
            listNames.add(ns);
        }
        br.close();
        return listNames;
    }

    public static void WriteToFile(String fileName){
        try(FileWriter fw = new FileWriter(fileName)){
            BufferedWriter out = new BufferedWriter(fw);
            for(int i=0;i<_listNames.size();i++){
                out.write(_listNames.get(i).firstName +" "+_listNames.get(i).lastName);
                out.newLine();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    public static void SortList(int start, int end){
        List<NamesStruct> sortedNames = _listNames.subList(start,end).stream().sorted(Comparator.comparing((NamesStruct name)->name.lastName).thenComparing((NamesStruct name)->name.firstName)).toList();
        for(int i=start; i<end; i++){
            _listNames.set(i,sortedNames.get(i));
        }
    }
    public static void main(String[] args) throws IOException {

        // Single Threaded
        String filePath = "";
        _listNames = MapFile(filePath);
        int namesSize = _listNames.size();
        long startTime= System.nanoTime();
        SortList(0,namesSize);
        long endTime= System.nanoTime();
        long duration = (endTime-startTime);
        long ms = duration/1000000;
        System.out.println("Single Threaded Processing Duration = "+ ms+"ms");

        // Multi Threaded
        Runtime runtime = Runtime.getRuntime();
        int availableProcessors = runtime.availableProcessors();
        long maxMemory = runtime.maxMemory();
        int maxThreads = (int) (2*((((maxMemory / (1024 * 1024)) / availableProcessors - 1))/2)); // subtract 100 just in case
        startTime= System.nanoTime();
        int newThreads = maxThreads<=1?1:maxThreads;
        int blockCount = namesSize/newThreads;
        int remainingBlock = namesSize % newThreads;
        int inc = (remainingBlock==0?0:1);
        ExecutorService executor = Executors.newFixedThreadPool(maxThreads+inc);
        while(newThreads>=1){
            int start=0;
            for(int i = 0;i<newThreads+inc;i++){
                if(i == newThreads)
                    executor.submit(new Task(start,remainingBlock));
                else
                    executor.submit(new Task(start,(i+1)*blockCount));
                start = (i+1)*blockCount;
            }
            newThreads /= 2;
            blockCount = namesSize/(newThreads==0?namesSize:newThreads);
            remainingBlock = namesSize % (newThreads==0?namesSize:newThreads);
        }
        executor.shutdown();
        //WriteToFile("");
        endTime= System.nanoTime();
        duration = (endTime-startTime);
        ms = duration/1000000;
        System.out.println("Parallel Processing Duration in = "+ms+"ms");

    }
}
