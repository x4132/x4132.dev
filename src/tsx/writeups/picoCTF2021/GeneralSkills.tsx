export default function GeneralSkills() {

    return <div className="d-flex justify-content-center" >
        <div className="d-flex flex-column align-items-center pt-2 w-50" >
            <div className="d-flex align-items-center" >
                <h1>PicoCTF2021 &nbsp;/&nbsp;</h1><h2>General Skills</h2>
            </div>
            <div className="mt-2 d-flex flex-column align-items-center" >
                <div>
                    <h3>Obedient Cat</h3>
                </div>
                <code>This file has a flag in plain sight (aka "in-the-clear").</code>
                <p className="mt-2" >
                    A flag is attached. Download & open for flag.
                </p>
                <div>
                    Flag: <code>picoCTF{"{s4n1ty_v3r1f13d_4a2b35fd}"}</code>
                </div>
            </div>
            <div className="mt-4 d-flex flex-column align-items-center" >
                <div>
                    <h3>Python Wrangling</h3>
                </div>
                <code>
                    Python scripts are invoked kind of like programs in the Terminal... Can you run this Python script using this password to get the flag?
                </code>
                <p className="mt-2" >
                    A python script, password, and encrypted flag is included.
                    You can run python scripts with <code>python &lt;filename&gt;</code>.
                </p>
                <code>
                    user@user~$ python ende.py -d &lt;encryptedflag&gt; <br />
                    Please enter the password: &lt;Your Password&gt; <br />
                    picoCTF{"{4p0110_1n_7h3_h0us3_68f88f93}"}
                </code>
            </div>
            <div className="mt-4 d-flex flex-column align-items-center" >
                <div>
                    <h3>Wave a Flag</h3>
                </div>
                <code>
                    Can you invoke help flags for a tool or binary? This program has extraordinarily helpful information...
                </code>
                <p className="mt-2" >
                    A single executable is included. Reading the hints says to use the --help or -h tag.
                </p>
                <code>
                    user@user~$ ./warm -h <br />
                    Oh, help? I actually don't do much, but I do have this flag here: picoCTF{"{b1scu1ts_4nd_gr4vy_6635aa47}"}
                </code>
            </div>
            <div className="mt-4 d-flex flex-column align-items-center" >
                <div>
                    <h3>Nice netcat...</h3>
                </div>
                <code>
                    There is a nice program that you can talk to by using this command in a shell: $ nc mercury.picoctf.net 49039, but it doesn't speak English...
                </code>
                <p className="mt-2 ">
                    A netcat command is included. Connecting to it returns a list of ascii numbers. Converting it to text returns the flag.
                </p>
                <code>
                    picoCTF{"{g00d_k1tty!_n1c3_k1tty!_3d84edc8}"}
                </code>
            </div>
        </div>
    </div>
}